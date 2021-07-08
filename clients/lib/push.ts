import logger from '@lib/logger';

type SocketEventListener = (data: Record<string, any>) => any;
type SocketData = { Type: string; [key: string]: any };

let retryCount = 0;

class PushServer {
  connection: any = null;
  token = '';
  retryLimit = 10;
  timerHeartbeat: any = null;
  heartbeatInterval = 30000;
  listenersMap: Map<string, Set<SocketEventListener>> = new Map();

  constructor() {
    this.setUp();

    // window.addEventListener('offline', this.offlineHandler);
    // window.addEventListener('online', this.onlineHandler);
  }

  getToken(): Promise<string> {
    if (this.token) {
      return Promise.resolve(this.token);
    }
    return fetch('/_otp')
      .then((response) => response.json())
      .then(({ token }) => {
        this.token = token;
        return this.token;
      });
  }

  initConnection(): Promise<WebSocket> {
    return this.getToken().then((token) => {
      if (!token) {
        throw Error('invalid websocket token');
      }
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
      const endpoint = `${protocol}://${window?.CONFIG?.websocket_hostname}/api/v1/message/ws?token=${token}`;
      if (!this.connection) {
        this.connection = new WebSocket(endpoint);
      }
      if (this.connection && this.connection.readyState > 1) {
        // close zombie connection
        this.connection.close();
        this.connection = new WebSocket(endpoint);
      }
      return this.connection;
    });
  }

  attachEvents = () => {
    this.connection.onopen = () => {
      this.heartbeat();
    };

    this.connection.onmessage = ((data: any) => {
      if (typeof data === 'string') {
        try {
          this.dispatchEvent(JSON.parse(data));
        } catch (err) {
          logger.error('invalid socket data: ', err);
        }
      }
    });

    this.connection.onclose = () => {
      // if socket will close, try to keep alive
      if (retryCount < this.retryLimit) {
        setTimeout(this.setUp, 2000);
        retryCount = retryCount + 1;
      }
    };
  }

  detachEvents() {
    this.connection.onopen = null;
    this.connection.onmessage = null;
    this.connection.onclose = null;
  }

  onlineHandler = () => {
    this.setUp();
  }

  offlineHandler = () => {
    this.detachEvents();
    this.stopHeartbeat();
  }

  heartbeat() {
    this.stopHeartbeat();
    // trigger first heartbeat
    this.connection.send('echo');
    this.timerHeartbeat = setInterval(() => {
      this.connection.send('echo');
    }, this.heartbeatInterval);
  }

  stopHeartbeat() {
    if (this.timerHeartbeat !== null) {
      clearInterval(this.timerHeartbeat);
      this.timerHeartbeat = null;
    }
  }

  setUp = () => {
    // reset retry count
    retryCount = 0;
    this.initConnection().then(this.attachEvents);
  }

  dispatchEvent = (data: SocketData): void => {
    const listeners = this.listenersMap.get(data.Type);
    listeners?.forEach((cb) => cb(data));
  }

  addEventListener(type: string, listener: SocketEventListener): void {
    const listeners = this.listenersMap.get(type) || new Set();
    listeners.add(listener);

    this.listenersMap.set(type, listeners);
  }

  removeEventListener(type: string, listener: SocketEventListener): void {
    const listeners = this.listenersMap.get(type) || new Set();
    listeners.delete(listener);

    this.listenersMap.set(type, listeners);
  }
}

export default new PushServer();

import logger from './logger';

type SocketEventListener = (data: Record<string, any>) => any;
type SocketData = { Type: string; [key: string]: any };

let retryCount = 0;

class PushServer {
  connection: any = null;
  retryLimit = 5;
  timerHeartbeat: any = null;
  heartbeatInterval = 30000;
  listenersMap: Map<string, Set<SocketEventListener>> = new Map();

  constructor() {
    this.setUp();

    window.addEventListener('offline', this.offlineHandler);
    window.addEventListener('online', this.onlineHandler);
  }

  getToken(): Promise<string> {
    return fetch('/_otp')
      .then((response) => response.json())
      .then(({ token }) => token)
      .catch((err: Error) => {
        // fetch token failed, close ws
        this.closeConnection();
      });
  }

  initConnection(): Promise<WebSocket> {
    return this.getToken().then((token) => {
      if (!token) {
        throw Error('Invalid websocket token');
      }
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
      const endpoint = `${protocol}://${window?.CONFIG?.websocket_hostname}/api/v1/message/ws?token=${token}`;
      if (!this.connection) {
        this.connection = new WebSocket(endpoint);
      }
      if (this.connection && this.connection.readyState > WebSocket.OPEN) {
        this.closeConnection();
        this.connection = new WebSocket(endpoint);
      }
      return this.connection;
    });
  }

  closeConnection(): void {
    if (this.connection) {
      this.detachEvents();
      this.stopHeartbeat();
      this.connection.close();
    }
  }

  attachEvents = (): void => {
    this.connection.onopen = () => {
      this.heartbeat();
    };

    this.connection.onmessage = (({ data }: MessageEvent) => {
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

    this.connection.onerror = () => {
      this.closeConnection();
    };
  }

  detachEvents() {
    this.connection.onopen = null;
    this.connection.onmessage = null;
    this.connection.onclose = null;
    this.connection.onerror = null;
  }

  onlineHandler = () => {
    // reset retry count
    retryCount = 0;
    this.setUp(() => {
      this.attachEvents();
      this.heartbeat();
    });
  }

  offlineHandler = () => {
    this.closeConnection();
  }

  heartbeat() {
    const echo = () => {
      if (this.connection.readyState === WebSocket.OPEN) {
        this.connection.send('echo');
      }
    };

    this.stopHeartbeat();
    // trigger first heartbeat
    echo();
    this.timerHeartbeat = setInterval(() => {
      echo();
    }, this.heartbeatInterval);
  }

  stopHeartbeat() {
    if (this.timerHeartbeat !== null) {
      clearInterval(this.timerHeartbeat);
      this.timerHeartbeat = null;
    }
  }

  setUp = (cb?: any) => {
    this.initConnection().then(cb || this.attachEvents);
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

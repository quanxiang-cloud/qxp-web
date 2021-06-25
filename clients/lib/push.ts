import logger from '@lib/logger';

function getOTP(): Promise<string> {
  return fetch('/_otp').then((response) => response.json()).then(({ token }) => token);
}

function ensureConnectionReady(connection: WebSocket): Promise<WebSocket> {
  return new Promise((resolve) => {
    resolve(connection);
  });
}

function makeConnection(): Promise<WebSocket> {
  return getOTP().then((token) => {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    const connection = new WebSocket(`${protocol}://${window?.CONFIG?.websocket_hostname}/api/v1/message/ws?token=${token}`);
    return ensureConnectionReady(connection);
  });
}

type SocketEventListener = (data: Record<string, any>) => any;
type SocketData = { Type: string; [key: string]: any };

class PushServer {
  connection: any = null;
  timeout = 10000;
  timeoutOjb: any = 0;
  serverTimeoutObj: any = null;
  resTimeoutObj: any = null;
  timeInterval = 1;
  listenersMap: Map<string, Set<SocketEventListener>> = new Map();

  constructor() {
    this.initialConnect();
  }

  initialConnect(): void {
    makeConnection().then((connection) => {
      this.connectWs(connection);
    });
  }

  disconnectNetHandle(): void {
    clearTimeout(this.timeoutOjb);
    clearTimeout(this.serverTimeoutObj);
  }

  connectNetHandle(): void {
    clearTimeout(this.timeoutOjb);
    clearTimeout(this.serverTimeoutObj);
    this.initialConnect();
  }

  connectWs(connection: any): void {
    window.addEventListener('offline', () => this.disconnectNetHandle());
    window.addEventListener('online', () => this.connectNetHandle());
    connection.onopen = () => {
      this.resTimeoutObj = null;
      this.heartStart();
    };
    connection.onmessage = ((data: any) => {
      if (typeof data === 'string') {
        try {
          // eslint-disable-next-line no-param-reassign
          data = JSON.parse(data);
          this.dispatchEvent(data);
        } catch (err) {
          logger.error('invalid socket data: ', err);
        }
      }
      this.heartReset();
    });
    connection.onclose = () => {
      this.resConnect();
    };
    this.connection = connection;
  }

  heartReset(): void {
    clearTimeout(this.timeoutOjb);
    clearTimeout(this.serverTimeoutObj);
    this.heartStart();
  }

  heartStart(): void {
    this.timeoutOjb = setTimeout(() => {
      this.connection.send('echo');
      this.serverTimeoutObj = setTimeout(() => {
        this.connection.close();
      }, this.timeout);
    }, this.timeout);
  }

  resConnect(): void {
    if (this.timeInterval >= 300) {
      this.timeInterval = 300;
    }
    this.resTimeoutObj = setTimeout(() => {
      this.initialConnect();
    }, this.timeInterval * 1000);

    this.timeInterval = this.timeInterval * 2;
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

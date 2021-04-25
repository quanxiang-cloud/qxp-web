import logger from '@lib/logger';

function getOTP(): Promise<string> {
  return fetch('/_otp').then((response) => response.json()).then(({ token }) => token);
}

function ensureConnectionReady(connection: WebSocket): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    connection.addEventListener('open', () => {
      resolve(connection);
    });

    connection.addEventListener('error', (e) => {
      reject(e);
    });
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
  connection: WebSocket | null = null;
  listenersMap: Map<string, Set<SocketEventListener>> = new Map();

  constructor() {
    this.initialConnect();
  }

  initialConnect(): void {
    makeConnection().then((connection) => {
      this.connection = connection;
      this.connection.addEventListener('message', ({ data }) => {
        if (typeof data === 'string') {
          try {
            // eslint-disable-next-line no-param-reassign
            data = JSON.parse(data);
          } catch (err) {
            logger.error('invalid socket data: ', err);
          }
        }
        this.dispatchEvent(data);
      });
      this.heartBeat(connection);
    }).catch((err) => {
      // todo retry
      logger.error('make websocket connection failed', err);
    });
  }

  heartBeat(connection: WebSocket): void {
    setInterval(() => {
      connection.send('echo');
    // }, 100 * 1000);
    }, 10 * 1000);
  }

  dispatchEvent = (data: SocketData) => {
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

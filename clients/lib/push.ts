import { wsSubscribe } from '@lib/api/common';
import { parseJSON } from '@lib/utils';

export type SocketEventListener = (data: SocketData) => any;
export type SocketData = { type: string; message: any, [key: string]: any };
type SubscribeParams = {
  key: string;
  topic: string;
  type: string;
  cb: SocketEventListener;
}

let retryCount = 0;

class PushServer {
  connection: any = null;
  retryLimit = 5;
  timerHeartbeat: any = null;
  heartbeatInterval = 30000;
  uuid = '';
  listenersMap: Map<string, Record<string, SocketEventListener>> = new Map();

  constructor() {
    this.setUp();

    window.addEventListener('offline', this.offlineHandler);
    window.addEventListener('online', this.onlineHandler);
  }

  subscribe({ key, topic, type, cb }: SubscribeParams): void {
    wsSubscribe({ key, topic, uuid: this.uuid }).then(() => {
      this.addEventListener(type, key, cb);
    });
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
        const wsData: SocketData = parseJSON(data, { type: '', message: '' });
        if (wsData.message?.uuid) {
          this.uuid = wsData.message.uuid;
        }
        this.dispatchEvent(wsData);
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
    const listenerMap = this.listenersMap.get(data.type) || {};
    Object.entries(listenerMap).map(([key, listener]) => {
      listener(data);
    });
  }

  addEventListener(type: string, key: string, listener: SocketEventListener): void {
    const listeners = this.listenersMap.get(type) || {};
    listeners[key] = listener;

    this.listenersMap.set(type, listeners);
  }

  removeEventListener(type: string, key: string): void {
    const listeners = this.listenersMap.get(type) || {};
    delete listeners[key];
    this.listenersMap.set(type, listeners);
  }
}

export default new PushServer();

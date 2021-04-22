function getOTP(): Promise<string> {
  return fetch('/_otp').then((response) => response.json()).then(({ token }) => token);
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
    getOTP().then((token) => {
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
      const connection = new WebSocket(`${protocol}://${window.CONFIG.websocket_hostname}/api/v1/message/ws?token=${token}`);
      connection.addEventListener('message', ({ data }) => this.dispatchEvent(data));
    });
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

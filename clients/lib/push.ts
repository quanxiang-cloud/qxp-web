function getOTP(): Promise<string> {
  return fetch('_otp').then((response) => response.json()).then(({ token }) => token);
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
      const connection = new WebSocket(`ws://keeper.test/api/v1/message/ws?token=${token}`);
      // const connection = new WebSocket('ws://lowcode.quanxiangyun.com/api/v1/message/ws?token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIwMDAwMDAiLCJleHAiOjE2MTkwOTM3NTgsInN1YiI6IjA0MDE3OWQwLTIzNGEtNDg3Yi04OWI0LTY4YjIyNDhiMTI1MyJ9.MbY4vcmjXhXKKyiW2HBZSMkEEqHwrDBITWsT4iHjcHMt2ZUuY7gyOCetZzvr6vKYCPE1oRKWfAznyi9MqVEDoA');
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

export class CancellableRequest<T> {
  private abortController: AbortController = new AbortController();

  constructor(private input: RequestInfo, private fetchOptions?: RequestInit) {}

  fetch = async (): Promise<T> => {
    const fetchOptions = this.fetchOptions || {};
    fetchOptions.signal = this.abortController.signal;
    const resp = await fetch(this.input, {
      ...fetchOptions,
      headers: {
        'X-Proxy': 'API',
        ...(fetchOptions.headers || {}),
      },
    });
    const data = await resp.json();
    return data;
  }

  cancel = () => {
    this.abortController.abort();
  }
}

// todo delete this
// https://attacomsian.com/blog/javascript-current-timezone
function getTimeZone(): string {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  if (offset === 0) {
    return 'UTC+0';
  }

  const delta = Math.abs(offset) / 60;

  if (offset > 0) {
    return `UTC-${delta}`;
  }

  return `UTC+${delta}`;
}

const TIME_ZONE = getTimeZone();

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
        'X-Timezone': TIME_ZONE,
        ...(fetchOptions.headers || {}),
      },
    });
    const data = await resp.json();
    return data;
  };

  cancel = () => {
    this.abortController.abort();
  };
}

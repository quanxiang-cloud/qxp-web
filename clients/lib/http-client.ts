function httpClient<TData>(
  url: string, body?: any, additionalHeaders?: HeadersInit
): Promise<TData> {
  const headers = {
    ...additionalHeaders,
    'content-type': 'application/json',
    'X-Proxy': 'API',
  };

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(body || {}),
    headers: headers,
  }).then((response) => {
    if (response.status !== 200) {
      return Promise.reject(new Error('todo some error message'));
    }

    return response.json();
  }).then((resp) => {
    const { code, message, data } = resp;
    if (code !== 0) {
      return Promise.reject(new Error(message));
    }

    return data as TData;
  });
}

export default httpClient;

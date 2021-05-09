function httpClient<TData>(
  path: string, body?: any, additionalHeaders?: HeadersInit,
): Promise<TData> {
  const headers = {
    'X-Proxy': 'API',
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };

  return fetch(path, {
    method: 'POST',
    body: JSON.stringify(body || {}),
    headers: headers,
  }).then((response) => {
    if (response.status === 401) {
      window.location.href = window.location.href;
      return Promise.reject(new Error('当前会话已失效，请重新登录!'));
    }
    if (response.status === 500) {
      return Promise.reject(new Error('请求失败!'));
    }
    return response.json();
  }).then((resp) => {
    const { code, msg, data } = resp;
    if (code !== 0 || ((typeof data.code !== 'undefined') && (data.code !== 0))) {
      return Promise.reject(new Error(msg));
    }

    return data as TData;
  });
}

export default httpClient;

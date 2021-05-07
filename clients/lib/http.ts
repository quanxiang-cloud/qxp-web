function httpClient<TData>(
  path: string, body?: any, additionalHeaders?: HeadersInit, isFormData?: boolean,
): Promise<TData> {
  const headers = {
    'X-Proxy': 'API',
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };

  let _body: any = JSON.stringify(body || {});
  if (isFormData) {
    const formData = new FormData();
    Object.keys(body).forEach((key) => {
      formData.append(key, body[key].toString());
    });
    _body = formData;
  }

  return fetch(path, {
    method: 'POST',
    body: _body,
    headers: headers,
  }).then((response) => {
    if (response.status === 401) {
      alert('当前会话已失效，请重新登录!');
      window.location.href = window.location.href;
      return Promise.reject(new Error('当前会话已失效，请重新登录!'));
    }
    if (response.status === 500) {
      return Promise.reject(new Error('请求失败!'));
    }
    return response.json();
  }).then((resp) => {
    const { code, msg, data } = resp;
    if (code !== 0) {
      return Promise.reject(new Error(msg));
    }

    return data as TData;
  });
}

export default httpClient;

function httpClient(url: string, body?: any, headers?: HeadersInit) {
  return fetch(url, {
    method: 'POST',
    body: body ? JSON.stringify(body): body,
    headers: headers,
  }).then((response) => {
    if (response.status !== 200) {
      // return response.headers.get('Content-Type')?.indexOf('application/json');
      return Promise.reject({
        code: response.status,
        message: 'todo some error message',
      });
    }

    return response.json();
  }).then(({ data }) => data);
}

export default httpClient;

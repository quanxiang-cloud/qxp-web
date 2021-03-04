/**
 * 发送一个POST请求到特定url
 * @param {string} url
 * @param {string} data
 * @returns {Promise<string | Record<string, unknown> | never}
 */
export const httpPost = (
  url: string,
  data: string,
): Promise<string | Record<string, unknown> | never> => {
  const req = new XMLHttpRequest()
  req.open('POST', url, true)
  req.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
  req.setRequestHeader('X-Proxy', 'API')
  return new Promise(
    (
      resolve: (responseText: string | Record<string, unknown>) => void,
      reject: (...data: unknown[]) => void,
    ) => {
      req.onload = () => {
        if (req.status > 400) {
          return reject(req.statusText)
        }
        const contentType = req.getResponseHeader('Content-Type')
        if (contentType?.startsWith('application/json')) {
          resolve(JSON.parse(req.responseText))
        } else {
          resolve(req.responseText)
        }
      }
      req.onerror = () => reject(req)
      req.send(data)
    },
  )
}

/**
 * 生成一个 uuid
 * @return {string}
 */
export const UUIDGeneratorBrowser = () =>
  // @ts-ignore
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );

function isA(name: string) {
  return (arg: unknown) => {
    return typeof(arg) === name
  }
}

export const isBool = isA('boolean')
export const isString = isA('string')

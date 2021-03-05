import { Message } from '@QCFE/lego-ui'

/**
 * 发送一个POST请求到特定url
 * @param {string} url
 * @param {string} data
 * @returns {Promise<string | Record<string, unknown> | never}
 */
export const httpPost = <T>(
  url: string,
  data?: string | null,
  headers?: { [key: string]: string },
): Promise<T | never> => {
  const req = new XMLHttpRequest()
  req.open('POST', url, true)
  req.setRequestHeader('X-Proxy', 'API')
  let keys: string[] = []
  if (headers) {
    keys = Object.keys(headers)
    keys.forEach((key) => {
      req.setRequestHeader(key, headers[key])
    })
  }
  if (!keys.find((key) => key.toLocaleLowerCase() === 'content-type')) {
    req.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
  }
  return new Promise((resolve: (arg: T) => void, reject: (...data: unknown[]) => void) => {
    req.onload = () => {
      if (req.status > 400) {
        Message.error(req.statusText)
        return reject(req.statusText)
      }
      const contentType = req.getResponseHeader('Content-Type')
      if (contentType?.startsWith('application/json')) {
        resolve(JSON.parse(req.responseText))
      } else {
        resolve((req.responseText as unknown) as T)
      }
    }
    req.onerror = () => {
      Message.error(req.responseText)
      reject(req)
    }
    if (data) {
      req.send(data)
    } else {
      req.send()
    }
  })
}

/**
 * 生成一个 uuid
 * @return {string}
 */
export const UUIDGeneratorBrowser = () =>
  // @ts-ignore
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  )

function isA(name: string) {
  return (arg: unknown) => {
    return typeof arg === name
  }
}

export const isBool = isA('boolean')
export const isString = isA('string')
export const isUndefined = isA('undefined')
export const isNull = (v: unknown) => v === null
export const either = <S>(pred1: (...args: S[]) => boolean, pred2: (...args: S[]) => boolean) => (
  ...args: S[]
) => pred1(...args) || pred2(...args)
export const isVoid = either<null | undefined>(isUndefined, isNull)
export const identity = <T>(i: T) => i
const curry = (fn: Function, arity = fn.length, ...args: any[]): Function => {
  return arity <= args.length ? fn(...args) : curry.bind(null, fn, arity, ...args)
}

/**
 * @param {string} attr 需要被计数的属性
 * @param {string} exclude 计数时排除属性条件
 * @param {function=>boolean} fn 计数的条件函数
 * @param {array | object} data 需要被计数的数据
 */
export const countBy = <T, S>(attr: string, exclude: string, fn: (arg: S) => boolean, data: T) => {
  let counter = 0
  Object.entries(data || {}).forEach(([key, value]) => {
    if (key === attr && fn(value as S)) {
      // @ts-ignore
      if ((exclude && isVoid(data[exclude])) || !exclude) {
        counter++
      }
    } else if (typeof value === 'object' || Array.isArray(data)) {
      counter += countBy(attr, exclude, fn, value)
    }
  })
  return counter
}

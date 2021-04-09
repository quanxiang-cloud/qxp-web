import { TreeNode } from '@c/headless-tree/types';

/**
 * send http post request
 */
export function httpPost<T>(
  url: string,
  data?: string | null,
  headers?: { [key: string]: string },
): Promise<ResponseToBeDelete<T> | never> {
  const req = new XMLHttpRequest();
  req.open('POST', url, true);
  if (!headers || !headers['X-Proxy']) {
    req.setRequestHeader('X-Proxy', 'API');
  }
  let keys: string[] = [];
  if (headers) {
    keys = Object.keys(headers);
    keys.forEach((key) => {
      req.setRequestHeader(key, headers[key]);
    });
  }
  if (!keys.find((key) => key.toLocaleLowerCase() === 'content-type')) {
    req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
  }
  return new Promise(
    (resolve: (arg: ResponseToBeDelete<T>) => void, reject: (...data: unknown[]) => void) => {
      req.onload = () => {
        const contentType = req.getResponseHeader('Content-Type');
        let response: ResponseToBeDelete<T>;
        if (contentType?.startsWith('application/json')) {
          response = JSON.parse(req.responseText);
        } else {
          response = (req.responseText as unknown) as ResponseToBeDelete<T>;
        }
        if (req.status >= 400) {
          if (req.statusText.toLocaleLowerCase() === 'unauthorized' || req.status === 401) {
            window.location.pathname = '/login/password';
            return;
          }
          // Message.error(`${req.statusText}: ${response.msg}`);
          return reject(response.msg);
        }
        resolve(response);
      };
      req.onerror = () => {
        // Message.error(req.responseText);
        reject(req);
      };
      if (data) {
        req.send(data);
      } else {
        req.send();
      }
    });
}

export const httpFile = async (url: string, data?: Record<string, string | Blob>) => {
  const formData = new FormData();
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const response = await fetch(url, {
    method: 'post',
    body: formData,
    headers: {
      'X-Proxy': 'API',
    },
  });

  return await response.json();
};

/**
 * 生成一个 uuid
 * @return {string}
 */
export const uuid = () =>
  // @ts-ignore
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  );

/**
 * generate a type checker func
 * @param {string} name
 * @return {*} function
 */
function isA(name: string): (arg: unknown) => boolean {
  return (arg: unknown) => {
    return typeof arg === name;
  };
}

export const isBool = isA('boolean');
export const isString = isA('string');
export const isUndefined = isA('undefined');
export const isFunction = isA('function');
export const isObject = (o: unknown) => o === Object(o);
export const isNull = (v: unknown) => v === null;
export const either = <S>(pred1: (...args: S[]) => boolean, pred2: (...args: S[]) => boolean) => (
  ...args: S[]
) => pred1(...args) || pred2(...args);
export const isVoid = either<null | undefined>(isUndefined, isNull);
export const identity = <T>(i: T) => i;
// const curry = (fn: Function, arity = fn.length, ...args: []): Function => {
//   return arity <= args.length ? fn(...args) : curry.bind(null, fn, arity, ...args);
// };

/**
 * @param {string} attr 需要被计数的属性
 * @param {string} exclude 计数时排除属性条件
 * @param {function} fn 计数的条件函数
 * @param {array | object} data 需要被计数的数据
 * @return {number} counter
 */
export const countBy = <T, S>(attr: string, exclude: string, fn: (arg: S) => boolean, data: T) => {
  let counter = 0;
  Object.entries(data || {}).forEach(([key, value]) => {
    if (key === attr && fn(value as S)) {
      // @ts-ignore
      if ((exclude && isVoid(data[exclude])) || !exclude) {
        counter += 1;
      }
    } else if (typeof value === 'object' || Array.isArray(data)) {
      counter += countBy(attr, exclude, fn, value);
    }
  });
  return counter;
};

/**
 * @param key {string} 搜索的 key
 * @param value {T} 搜索的 key 对应的值
 * @param obj {S} 搜索的数据源
 */
export const searchByKey = <T, S, K>(key: string, value: T, obj: S): K | void => {
  for (const k in obj) {
    if (k === key && ((obj[k] as unknown) as T) === value) {
      return (obj as unknown) as K;
    } else if (typeof obj[k] === 'object' || Array.isArray(obj[k])) {
      const data = searchByKey<T, S, K>(key, value, (obj[k] as unknown) as S);
      if (data) {
        return data;
      }
    }
  }
  return;
};

/**
 * deep clone array or object
 * @param obj {array | object}
 */
export const deepClone = (obj: any) => {
  if (obj === null) return null;
  const clone = Object.assign({}, obj);
  Object.keys(clone).forEach(
    (key) => (clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]),
  );
  if (Array.isArray(obj)) {
    clone.length = obj.length;
    return Array.from(clone);
  }
  return clone;
};

/**
 * generate a generator of number in range from start to end
 * @param {number} start
 * @param {number} end
 * @param {number} [step=1]
 */
export const rangeGenerator = function* (start: number, end: number, step = 1) {
  let i = start;
  while (i < end) {
    yield i;
    i += step;
  }
};

/**
 * build a range array of number from start to end
 * @param {number} start
 * @param {number} end
 * @param {number} [step]
 * @return {*}
 */
export const range = (start: number, end: number, step?: number) => {
  return [...rangeGenerator(start, end, step)];
};

export const mapTreeData = <T extends unknown>(rules: Record<string, string>, data: Object[]) => {
  const arrData: T[] = [];
  const childKey = rules.children;
  for (const item of data) {
    const it = item as any;
    const children = it[childKey];
    arrData.push({
      key: it[rules.key],
      title: it[rules.title],
      children: children && children.length ? mapTreeData(rules, children) : [],
      ...it,
    });
  }
  return arrData as T;
};

export const getNestedPropertyToArray = <T>(
  data: Record<string, any> | undefined,
  targetKey: string,
  nestKey: string,
): T[] => {
  if (!data) {
    return [];
  }
  const arrData: T[] = [];
  if (isObject(data)) {
    Object.entries(data).forEach(([key, value]) => {
      if (key === targetKey) {
        arrData.push(value);
      }
      if (key === nestKey) {
        arrData.push(...getNestedPropertyToArray<T>(value, targetKey, nestKey));
      }
    });
  } else if (Array.isArray(data)) {
    data.forEach((item) => {
      const arr: T[] = getNestedPropertyToArray(item, targetKey, nestKey);
      arrData.push(...arr);
    });
  }
  return arrData;
};

export const isLengthEqual = (a: unknown, b: unknown) => {
  if (a instanceof Array && b instanceof Array) {
    a.length === b.length;
  }
};

export const loadImage = (src: string) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = reject;
  });
};

export function departmentToTreeNode(department: Department): TreeNode<Department> {
  const children = (department.child || []).map((dep) => departmentToTreeNode(dep));

  return {
    data: department,
    name: department.departmentName,
    id: department.id,
    parentId: department.pid,
    path: '',
    isLeaf: !department.child?.length,
    visible: true,
    childrenStatus: 'resolved',
    expanded: true,
    order: 0,
    level: department.grade,
    children: children,
  };
}

export const last = <T>(arg: T[]) => {
  return arg[arg.length - 1];
};

export function isPassword(pwd: string) {
  return /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{8,}$/.test(pwd);
}

export function isPromise(a: unknown) {
  return a instanceof Promise;
}

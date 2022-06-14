import qs from 'qs';
import { isObject } from 'lodash';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

import type { TreeNode } from '@c/headless-tree/types';
import toast from '@lib/toast';

export function uuid(): string {
  return nanoid();
}

export const httpFile = async (url: string, data?: Record<string, string | Blob>): Promise<any> => {
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
 * generate a type checker func
 * @param {string} name
 * @return {*} function
 */
function isA(name: string): (arg: unknown) => boolean {
  return (arg: unknown) => {
    return typeof arg === name;
  };
}

export const isString = isA('string');
export const isUndefined = isA('undefined');
export const isFunction = isA('function');
export const isNull = (v: unknown): boolean => v === null;
export const either = <S>(pred1: (...args: S[]) => boolean, pred2: (...args: S[]) => boolean): any => (
  ...args: S[]
) => pred1(...args) || pred2(...args);
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

export const deepClone = (obj: any): any => {
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
  } else if (data && Array.isArray(data)) {
    (data as any[]).forEach((item) => {
      const arr: T[] = getNestedPropertyToArray(item, targetKey, nestKey);
      arrData.push(...arr);
    });
  }
  return arrData;
};

export function departmentToTreeNode(department: Department, level = 0): TreeNode<Department> {
  const children = (department.child || []).map((dep) => departmentToTreeNode(dep, level + 1));

  return {
    data: department,
    name: department.name,
    id: department.id,
    parentId: department.pid,
    path: '',
    isLeaf: !department.child?.length,
    visible: true,
    childrenStatus: 'resolved',
    expanded: level === 0,
    order: 0,
    level: level,
    children: children,
  };
}

export function isPassword(pwd: string): boolean {
  // eslint-disable-next-line
  return /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&?*.`\(\)\-\+\[\]\|\"\'\_\,\、])[\da-zA-Z~!@#$%^&?*.`\(\)\-\+\[\]\|\"\'\_\,\、]{8,}$/.test(pwd);
}

export function copyToClipboard(str: string, msg: string): void {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selected =
    document.getSelection()?.rangeCount as number > 0 ?
      document.getSelection()?.getRangeAt(0) :
      false;
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection()?.removeAllRanges();
    document.getSelection()?.addRange(selected);
  }
  toast.success(msg || '复制成功');
}

export function getQuery<T>(): T {
  const search = window.location.search;
  if (search) {
    return qs.parse(search.split('?').pop() || '') as unknown as T;
  }

  return {} as T;
}

export function toggleArray<T>(arr1: T[], value: T, condition = true): T[] {
  if (condition && arr1.includes(value)) {
    return arr1.filter((v) => v !== value);
  }
  return [...arr1, value];
}

export function parseJSON<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

export function handleTimeFormat(time: string): string {
  const timeStamp = new Date(time).getTime();
  const currTimeStamp = new Date().getTime();

  const timeDiffer = Math.abs(currTimeStamp - timeStamp);

  const _second = Math.floor(timeDiffer / 1000);
  if (_second <= 180) {
    return '刚刚';
  }

  const _minute = Math.floor(timeDiffer / (1000 * 60));
  if (3 < _minute && _minute < 60) {
    return `${_minute}分钟前`;
  }

  const currZeroPointStamp = new Date(new Date().toLocaleDateString()).getTime();
  const oldZeroPointStamp = currZeroPointStamp - 86400000;

  if (timeStamp >= currZeroPointStamp && timeStamp <= currTimeStamp) {
    const _hour = Math.floor(timeDiffer / (1000 * 60 * 60));
    return `${_hour}小时前`;
  }

  if (timeStamp >= oldZeroPointStamp && timeStamp < currZeroPointStamp) {
    return '昨天 ' + dayjs(time).format('HH:mm');
  }

  const currYear = new Date().getFullYear();
  const currYearZeroPointStamp = new Date(`${currYear}-01-01 00:00:00`).getTime();
  if (currYearZeroPointStamp <= timeStamp) {
    return dayjs(time).format('MM-DD HH:mm');
  }

  return dayjs(time).format('YYYY-MM-DD HH:mm');
}

export function isMeanless(value: any): boolean {
  if (value === undefined || value === null || value === '' || value.toString() === '') {
    return true;
  }

  return false;
}

export function getUserDepartment(user: CurrentUser): Department {
  const dep = getTwoDimenArrayHead(user.deps) as Department;
  return dep;
}

export function getTwoDimenArrayHead<T>(dep?: T[][]): T | undefined {
  return dep?.[0]?.[0];
}

export function not<A extends any[]>(fn: (...args: [...A]) => boolean) {
  return (...args: [...A]): boolean => {
    return !fn(...args);
  };
}

export async function copyContent(content: string, successMes?: string, errorMes?: string): Promise<void> {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(content);
      toast.success(successMes || '复制成功！');
    } catch (err) {
      toast.error(errorMes || '复制失败，请手动复制！');
    }
    return;
  }

  const el = document.createElement('textarea');
  el.value = content;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  const successful = document.execCommand('copy');
  if (successful) {
    toast.success(successMes || '复制成功！');
  } else {
    toast.error(errorMes || '复制失败，请手动复制！');
  }
  document.body.removeChild(el);
}

// macOS X:1000 KB = 1 MB Non-macOS X : 1024 KB = 1 MB
export const isMacosX = /macintosh|mac os x/i.test(navigator.userAgent);

export function isAcceptedFileType(file: File | QXPUploadFileBaseProps, accept: string[]): boolean {
  const suffix = file.name.split('.').pop();
  if (!accept || !suffix) return false;
  const { type: fileType } = file;
  return accept.some((acceptType) => acceptType === fileType || acceptType.split('/')[1]?.includes(suffix) ||
  acceptType.split('.')[1]?.includes(suffix));
}

export function createQueue(
  tasks: (() => Promise<void>)[],
  maxNumOfWorkers = 1,
): Promise<void> {
  let numOfWorkers = 0;
  let taskIndex = 0;

  return new Promise((done, failed) => {
    const getNextTask = (): void => {
      if (numOfWorkers < maxNumOfWorkers && taskIndex < tasks.length) {
        tasks[taskIndex]()
          .then(() => {
            numOfWorkers -= 1;
            getNextTask();
          })
          .catch((error: Error) => {
            failed(error);
          });
        taskIndex += 1;
        numOfWorkers += 1;
        getNextTask();
      } else if (numOfWorkers === 0 && taskIndex === tasks.length) {
        done();
      }
    };
    getNextTask();
  });
}

export function realizeLink(appID: string, link: string): string {
  const replacements: Record<string, string> = {
    user_id: window.USER.id,
    user_name: window.USER.name,
    user_email: window.USER.email,
    user_phone: window.USER.phone,
    dep_id: window.USER.deps?.[0]?.[0].id,
    dep_name: window.USER.deps?.[0]?.[0].name,
    appid: appID,
  };

  let _link = link;
  Object.keys(replacements).forEach((key) => {
    _link = _link.replace(new RegExp('\\$\\{' + key + '\\}', 'g'), replacements?.[key]);
  });
  return _link;
}

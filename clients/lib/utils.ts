import qs from 'qs';
import { TreeData, TreeItem } from '@atlaskit/tree';
import _, { isObject } from 'lodash';
import { TreeNode } from '@c/headless-tree/types';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

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
export const isVoid = either<null | undefined>(isUndefined, isNull);

/**
 * @param {string} attr 需要被计数的属性
 * @param {string} exclude 计数时排除属性条件
 * @param {function} fn 计数的条件函数
 * @param {array | object} data 需要被计数的数据
 * @return {number} counter
 */
export const countBy = <T, S>(
  attr: string,
  exclude: string,
  fn: (arg: S) => boolean, data: T & Record<string, any>): number => {
  let counter = 0;
  Object.entries(data || {}).forEach(([key, value]) => {
    if (key === attr && fn(value as S)) {
      if ((exclude && isVoid(data[exclude])) || !exclude) {
        counter += 1;
      }
    } else if (typeof value === 'object' || Array.isArray(data)) {
      counter += countBy(attr, exclude, fn, value);
    }
  });
  return counter;
};

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

export const last = <T>(arg: T[]): T => {
  return arg[arg.length - 1];
};

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

function _buildTreeDataItems(
  items: { [key: string]: TreeItem },
  menus: Array<PageInfo>,
): { [key: string]: TreeItem } {
  const childItems = menus.map((page) => {
    return _buildTreeDataItems(items, page.child || []);
  }).reduce((acc, childItems) => {
    return { ...acc, ...childItems };
  }, {});

  const newItems = menus.reduce<{ [key: string]: TreeItem }>((acc, page) => {
    acc[page.id] = {
      id: page.id,
      children: (page.child || []).map((childPage) => childPage.id),
      hasChildren: page.menuType === 1,
      isExpanded: false,
      isChildrenLoading: false,
      data: page,
    };
    return acc;
  }, items);

  return {
    ...childItems,
    ...newItems,
  };
}

export function buildAppPagesTreeData(menus: Array<PageInfo>): TreeData {
  const rootItem: { [key: string]: TreeItem } = {
    ROOT: {
      id: 'ROOT',
      children: menus.map((childPage) => childPage.id),
      hasChildren: !!menus.length,
      isExpanded: true,
      isChildrenLoading: false,
    },
  };

  const treeData: TreeData = {
    rootId: 'ROOT',
    items: _buildTreeDataItems(rootItem, menus),
  };

  return treeData;
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

export function isEmpty(value: any): boolean {
  if (value === undefined || value === null || value === '' || value.toString() === '') {
    return true;
  }

  return false;
}

export function getUserDepartment(user: CurrentUser): UserDepartment {
  let dep = user.dep;
  while (dep.child) {
    dep = dep.child;
  }
  return dep;
}

export function not<A extends any[]>(fn: (...args: [...A]) => boolean) {
  return (...args: [...A]): boolean => {
    return !fn(...args);
  };
}

export function quickSortObjectArray<T extends Record<string, T[keyof T]>>(key: string, arr: T[]): T[] {
  if (!arr?.length || !key) return [];
  const [head, ...tail] = arr;
  const left = tail.filter((e) => (e[key] ?? 0) < (head[key] ?? 0));
  const right = tail.filter((e) => (e[key] ?? 0) >= (head[key] ?? 0));
  return quickSortObjectArray<T>(key, left).concat(head, quickSortObjectArray(key, right));
}

export function isEmptyObject(value: unknown): boolean {
  return _.isObject(value) && _.isEmpty(value);
}

export function isEmptyArray(value: unknown): boolean {
  return _.isArray(value) && _.isEmpty(value);
}

export async function copyContent(content: string): Promise<void> {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('复制成功！');
    } catch (err) {
      toast.error('复制失败，请手动复制！');
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
    toast.success('复制成功！');
  } else {
    toast.error('复制失败，请手动复制！');
  }
  document.body.removeChild(el);
}

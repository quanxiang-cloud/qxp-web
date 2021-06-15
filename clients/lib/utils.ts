import qs from 'qs';
import { TreeData, TreeItem } from '@atlaskit/tree';
import { get, isObject } from 'lodash';
import { TreeNode } from '@c/headless-tree/types';
import { nanoid } from 'nanoid';

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
export const identity = <T>(i: T): T => i;

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
  return /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*.\(\)\-\+\[\]\|\"\'\_])[\da-zA-Z~!@#$%^&*.\(\)\-\+\[\]\|\"\'\_]{8,}$/.test(pwd);
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

export function jsonValidator<T>(data: T, schema: Record<string, (v: any) => boolean>): boolean {
  return Object.entries(schema).every(([path, validator]) => {
    const values = path.split(',').reduce((cur: any[], next) => {
      cur.push(get(data, next));
      return cur;
    }, []);
    return validator(values.length === 1 ? values[0] : values);
  });
}

export function parseJSON<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

export function compactObject(data: Record<string, any> | any[]): Record<string, any> {
  if ((typeof data !== 'object' && !Array.isArray(data)) || data == null) {
    return data;
  }
  const isArray = Array.isArray(data);
  return Object.entries(data).reduce((cur: any[] | Record<string, any>, [key, value]) => {
    const vIsObject = (typeof value === 'object' && value !== null) || !Array.isArray(value);
    if (isArray) {
      (value !== null) && cur.push(vIsObject ? compactObject(value) : value);
    } else {
      (value !== null) && Object.assign(cur, { [key]: vIsObject ? compactObject(value) : value });
    }
    return cur;
  }, isArray ? [] : {});
}

export function isObjectArray(src: unknown): boolean {
  return Array.isArray(src) && src.every((item) => isObject(item));
}

import moment from 'moment';
import { TreeData, TreeItem } from '@atlaskit/tree';

import { TreeNode } from '@c/headless-tree/types';
// todo starry tan, move this into app-management
import { getFilterField } from '@portal/modules/app-management/pages/form-design/utils';
import appPageDataStore from '@portal/modules/app-management/components/app-page-data/store';

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
          return reject(response.msg);
        }
        resolve(response);
      };
      req.onerror = () => {
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
  return /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*.\(\)\-\+\[\]\|\"\'\_])[\da-zA-Z~!@#$%^&*.\(\)\-\+\[\]\|\"\'\_]{8,}$/.test(pwd);
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

  const newItems = menus.reduce<{ [key: string]: TreeItem}>((acc, page) => {
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

export function getPagesTreeData(menus: Array<PageInfo>): TreeData {
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

function getTableCellData(initValue: any, field: any) {
  if (field.type === 'datetime') {
    if (Array.isArray(initValue)) {
      return initValue.map((value: string) => {
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
      }).join('-');
    }

    return moment(initValue).format('YYYY-MM-DD HH:mm:ss');
  }

  if (field.enum && field.enum.length) {
    if (Array.isArray(initValue)) {
      return initValue.map((_value: string) => {
        return field.enum.find(({ value }: any) => value === _value)?.label || '';
      }).join(',');
    }

    return field.enum.find(({ value }: any) => value === initValue)?.label || '';
  }

  return initValue;
}

export function getPageDataSchema(config: any, schema: any, pageID: string) {
  const { pageTableShowRule = {}, pageTableConfig, filtrate = [] } = config || {};
  const { setFiltrates, setTableConfig, setTableColumns, setTableID } = appPageDataStore;
  const fieldsMap = schema?.properties || {};
  const tableColumns: any[] = [];
  let recordColNum = 0;
  let fixedColumnIndex: number[] = [];
  switch (pageTableShowRule.fixedRule) {
  case 'one':
    fixedColumnIndex = [0];
    break;
  case 'previous_two':
    fixedColumnIndex = [0, 1];
    break;
  }

  Object.keys(fieldsMap).forEach((key: string) => {
    const hasVisible = pageTableConfig && pageTableConfig[key] ?
      'visible' in pageTableConfig[key] : false;

    if (key !== '_id' && ((hasVisible && pageTableConfig[key].visible) || !hasVisible)) {
      const isFixed = fixedColumnIndex.includes(recordColNum);
      tableColumns.push({
        id: key,
        Header: fieldsMap[key].title || '',
        accessor: (data: any) => getTableCellData(data[key], fieldsMap[key]),
        fixed: isFixed,
        width: isFixed && 150,
      });
      recordColNum += 1;
    }
  });

  if (pageTableConfig) {
    tableColumns.sort((a, b) => {
      return pageTableConfig[a.id]?.sort - pageTableConfig[b.id]?.sort;
    });
  }

  setFiltrates(filtrate.map((field: PageField) => {
    return getFilterField(field);
  }));
  setTableColumns(tableColumns);
  setTableConfig(pageTableShowRule);
  setTableID(pageID);
}

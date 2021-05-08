import { QueryFunctionContext } from 'react-query';

import httpClient from '@lib/http-client';

export type Options = {
  label: string;
  value: string;
}[];

interface MenuListItem {
  id: string;
  name: string;
  child: MenuListItem[];
}
export async function getFormDataOptions({ queryKey }: QueryFunctionContext): Promise<Options> {
  const data = await httpClient<{
      menu: MenuListItem[],
  }>('/api/v1/structor/menu/list', {
    appID: queryKey[1],
  });
  function parseMenuList(menuList: MenuListItem[]) {
    return menuList.reduce((prev: {label: string; value: string}[], current) => {
      prev.push({
        label: current.name,
        value: current.id,
      });
      if (current.child) {
        prev.push(...parseMenuList(current.child));
      }
      return prev;
    }, []);
  }
  return parseMenuList(data.menu);
}

interface FormFieldOptions {
  table?: {
    [key: string]: { title: string; type: string; }
  }
}
export async function getFormFieldOptions({ queryKey }: QueryFunctionContext): Promise<Options> {
  const data = await httpClient<FormFieldOptions | null>('/api/v1/structor/process/getByID', {
    tableID: queryKey[1],
  });
  function parseFormFieldOptions({ table = {} }: FormFieldOptions) {
    return Object.entries(table).reduce((prev: {label: string; value: string;}[], [id, value]) => {
      prev.push({
        label: value.title,
        value: id,
      });
      return prev;
    }, []);
  }
  return parseFormFieldOptions(data || {});
}

export interface FieldList {
  custom: {label: string; name: string, children?: string[]; parent?: string}[];
  system: {label: string; name: string}[];
}
export function getFieldsList(): Promise<FieldList> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        custom: [{
          label: '姓名',
          name: 'username',
        }, {
          label: '年龄',
          name: 'age',
        }, {
          label: '明细',
          name: 'detail',
          children: ['4', '5', '6'],
        }, {
          label: '金额',
          name: 'amount',
          parent: 'detail',
        }, {
          label: '规格',
          name: 'specification',
          parent: 'detail',
        }, {
          label: '数量',
          name: 'number',
          parent: 'detail',
        }, {
          label: '附件',
          name: 'annex',
        }],
        system: [{
          label: '提交时间',
          name: 'submit_time',
        }, {
          label: '发起人',
          name: 'sponsor',
        }],
      });
    }, 100);
  });
}

export interface OperationItem {
  enabled: boolean;
  changeable: boolean;
  name: string;
  defaultText?: string;
  text?: string;
}
export function getOperationList(): Promise<{
  default: OperationItem[];
  custom: OperationItem[];
}> {
  return new Promise((r) => {
    return r({
      default: [{
        enabled: true,
        changeable: false,
        name: '操作',
        defaultText: 'pass',
        text: '通过',
      }, {
        enabled: true,
        changeable: false,
        name: '驳回',
        defaultText: 'reject',
        text: '不同意',
      }],
      custom: [{
        enabled: false,
        changeable: true,
        name: '转交',
      }, {
        enabled: true,
        changeable: true,
        name: '邀请阅示',
        defaultText: 'notification',
        text: '通知',
      }, {
        enabled: false,
        changeable: true,
        name: '回退',
      }, {
        enabled: false,
        changeable: true,
        name: '打回',
      }, {
        enabled: false,
        changeable: true,
        name: '抄送',
      }, {
        enabled: false,
        changeable: true,
        name: '加签',
      }],
    });
  });
}

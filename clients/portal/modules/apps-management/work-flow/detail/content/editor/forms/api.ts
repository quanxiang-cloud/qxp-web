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
  }>(`/api/v1/structor/${queryKey[1]}/menu/list`, {
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
  const data = await httpClient<FormFieldOptions | null>(
    `/api/v1/structor/${queryKey[2]}/process/getByID`, {
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

export interface OperationItem {
  enabled: boolean;
  changeable: boolean;
  name: string;
  text?: string;
  value: string;
}

const operationList = {
  system: [{
    enabled: true,
    changeable: false,
    name: '通过',
    text: '通过',
    value: 'AGREE',
  }, {
    enabled: true,
    changeable: false,
    name: '拒绝',
    text: '拒绝',
    value: 'REFUSE',
  }],
  custom: [{
    enabled: false,
    changeable: true,
    name: '撤回',
    text: '撤回',
    value: 'CANCEL',
  }, {
    enabled: false,
    changeable: true,
    name: '提交',
    text: '提交',
    value: 'FILL_IN',
  }, {
    enabled: false,
    changeable: true,
    name: '委托',
    text: '委托',
    value: 'ENTRUST',
  }, {
    enabled: false,
    changeable: true,
    name: '退回某步',
    text: '退回某步',
    value: 'STEP_BACK',
  }, {
    enabled: false,
    changeable: true,
    name: '打回重填',
    text: '打回重填',
    value: 'SEND_BACK',
  }, {
    enabled: false,
    changeable: true,
    name: '抄送',
    text: '抄送',
    value: 'CC',
  }, {
    enabled: false,
    changeable: true,
    name: '加签',
    text: '加签',
    value: 'ADD_SIGN',
  }, {
    enabled: false,
    changeable: true,
    name: '阅示',
    text: '阅示',
    value: 'READ',
  }],
};
export function getOperationList({ queryKey }: QueryFunctionContext): Promise<{
  system?: OperationItem[];
  custom: OperationItem[];
}> {
  return new Promise((r) => {
    const type = queryKey[1];
    if (type === 'fillIn') {
      return r({
        custom: operationList.custom,
      });
    }
    return r(operationList);
  });
}

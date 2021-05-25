import { QueryFunctionContext } from 'react-query';

import httpClient from '@lib/http-client';

import { WorkTableInternalFields } from '../utils/constants';

export type Option = {
  label: string;
  value: string;
  children?: Option[];
};

export type Options = Option[];

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
      if (!WorkTableInternalFields.includes(id)) {
        prev.push({
          label: value.title,
          value: id,
        });
      }
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
    only: 'approve',
  }, {
    enabled: true,
    changeable: false,
    name: '拒绝',
    text: '拒绝',
    value: 'REFUSE',
    only: 'approve',
  }, {
    enabled: true,
    changeable: false,
    name: '提交',
    text: '提交',
    value: 'FILL_IN',
    only: 'fillIn',
  }],
  custom: [{
    enabled: false, // common
    changeable: true,
    name: '撤回',
    text: '撤回',
    value: 'CANCEL',
  }, {
    enabled: false, // common
    changeable: true,
    name: '转交',
    text: '转交',
    value: 'ENTRUST',
  }, {
    enabled: false,
    changeable: true,
    name: '回退',
    text: '回退',
    value: 'STEP_BACK',
    only: 'approve',
  }, {
    enabled: false,
    changeable: true,
    name: '打回重填',
    text: '打回重填',
    value: 'SEND_BACK',
    only: 'approve',
  }, {
    enabled: false, // common
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
    only: 'approve',
  }, {
    enabled: false, // common
    changeable: true,
    name: '邀请阅示',
    text: '邀请阅示',
    value: 'READ',
  }],
};
export function getOperationList({ queryKey }: QueryFunctionContext): Promise<{
  system?: OperationItem[];
  custom: OperationItem[];
}> {
  return new Promise((r) => {
    const type = queryKey[1];
    return r({
      system: operationList.system.filter(({ only }) => !only || only === type),
      custom: operationList.custom.filter(({ only }) => !only || only === type),
    });
  });
}

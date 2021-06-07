import React from 'react';
import moment from 'moment';

import { UnionColumns } from 'react-table';

export type Scheme = Record<string, any>;
export type PageTableShowRule = {
  fixedRule?: string;
  order?: string;
  pageSize?: number | null;
}
export type Config = {
  filter?: FilterMaps;
  pageTableConfig?: Record<string, any>;
  pageTableShowRule?: PageTableShowRule;
};

type Option = {
  value: string;
  label: string;
}

export function operateButton(wIndex: number, authority: number, button: React.ReactNode) {
  const weightArr = authority.toString(2).split('').reverse();
  if (weightArr.length < 7) {
    for (let index = 0; index < 7 - weightArr.length; index += 1) {
      weightArr.push('0');
    }
  }
  if (weightArr[wIndex - 1] === '0') {
    return null;
  }

  return button;
}

export function getTableCellData(
  initValue: string | string[] | Record<string, unknown>,
  field: ISchema,
): string | JSX.Element | Record<string, any>[] {
  if (!initValue) {
    return (<span className='text-gray-300'>——</span>);
  }

  if (field.type === 'datetime') {
    const format = field['x-component-props']?.format || 'YYYY-MM-DD HH:mm:ss';
    if (Array.isArray(initValue)) {
      return initValue.map((value: string) => {
        return moment(value).format(format);
      }).join('-');
    }

    return moment(initValue).format(format);
  }

  if (field.enum && field.enum.length) {
    if (Array.isArray(initValue)) {
      return initValue.map((_value: string) => {
        if (!field.enum) {
          return '';
        }

        const enumTmp = field.enum[0];
        if (typeof enumTmp === 'object') {
          return (field.enum.find(({ value }: any) => value === _value) as Option)?.label || '';
        }

        return _value;
      }).join(',');
    }

    if (typeof field.enum[0] === 'object') {
      return (field.enum.find(({ value }: any) => value === initValue) as Option)?.label || '';
    }

    return initValue as string;
  }

  if (field['x-component']?.toLowerCase() === 'subtable') {
    return initValue as unknown as Record<string, any>[];
  }

  if (Array.isArray(initValue)) {
    return initValue.join(',');
  }

  if (typeof initValue === 'string') {
    return initValue;
  }

  if (initValue?.label) {
    return initValue?.label as string;
  }

  return initValue.toString();
}

function addFixedParameters(fixedList: number[], tableColumns: UnionColumns<Record<string, any>>[]) {
  fixedList.forEach((index) => {
    if (tableColumns[index]) {
      tableColumns[index] = { ...tableColumns[index], fixed: true, width: 150 };
    }
  });
}

export function setFixedParameters(
  fixedRule: string | undefined,
  tableColumns: UnionColumns<Record<string, any>>[]
) {
  let action: UnionColumns<any> = {
    id: 'action',
    Header: '操作',
  };
  switch (fixedRule) {
  case 'one':
    addFixedParameters([0], tableColumns);
    break;
  case 'previous_two':
    addFixedParameters([0, 1], tableColumns);
    break;
  case 'action':
    action = { ...action, fixed: true, width: 150 };
    break;
  case 'one_action':
    addFixedParameters([0], tableColumns);
    action = { ...action, fixed: true, width: 150 };
    break;
  }
  return [...tableColumns, action];
}

export function getPageDataSchema(
  config: Config,
  schema: Scheme,
) {
  const { pageTableShowRule = {}, pageTableConfig = {} } = config || {};
  const fieldsMap = schema?.properties || {};
  const fields: Fields[] = [];
  const tableColumns: any[] = [];
  Object.keys(fieldsMap).forEach((key: string) => {
    if (key === '_id' || fieldsMap[key]['x-component']?.toLowerCase() === 'subtable') {
      return;
    }

    fields.push({ id: key, ...fieldsMap[key] });
    const hasVisible = pageTableConfig[key] ? 'visible' in pageTableConfig[key] : false;
    if ((hasVisible && pageTableConfig[key].visible) || !hasVisible) {
      tableColumns.push({
        id: key,
        Header: fieldsMap[key].title || '',
        accessor: (data: any) => getTableCellData(data[key], fieldsMap[key]),
      });
    }
  });

  tableColumns.sort((a, b) => {
    const sortA = pageTableConfig[a.id]?.sort ?
      pageTableConfig[a.id]?.sort : fieldsMap[a.id]['x-index'];
    const sortB = pageTableConfig[b.id]?.sort ?
      pageTableConfig[b.id]?.sort : fieldsMap[b.id]['x-index'];
    return sortA - sortB;
  });

  return {
    tableColumns: setFixedParameters(pageTableShowRule.fixedRule, tableColumns),
    pageTableShowRule,
    fields,
  };
}

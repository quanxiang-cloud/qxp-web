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
  filters?: Filters;
  pageTableColumns?: string[];
  pageTableShowRule?: PageTableShowRule;
};

type Option = {
  value: string;
  label: string;
}

export function getTableCellData(
  initValue: string | string[] | Record<string, unknown> | Record<string, unknown>[],
  field: ISchema,
): string | JSX.Element | Record<string, any>[] {
  if (field.type === 'array') {
    return initValue as unknown as Record<string, any>[] || [];
  }

  if (field.type === 'label-value') {
    return (([] as Record<string, unknown>[]).concat(initValue as Record<string, unknown>[]))
    .map(itm=>itm.label).join(',')
  }

  if (!initValue) {
    return (<span className='text-gray-300'>——</span>);
  }

  if (field.type === 'datetime') {
    const format = field['x-component-props']?.format || 'YYYY-MM-DD HH:mm:ss';
    if (Array.isArray(initValue)) {
      return (initValue as string[]).map((value: string) => {
        return moment(value).format(format);
      }).join('-');
    }

    return moment(initValue).format(format);
  }

  if (field.enum && field.enum.length) {
    if (Array.isArray(initValue)) {
      return (initValue as string[]).map((_value: string) => {
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

function addFixedParameters(
  fixedList: number[],
  tableColumns: UnionColumns<Record<string, any>>[],
): void {
  fixedList.forEach((index) => {
    if (tableColumns[index]) {
      tableColumns[index] = { ...tableColumns[index], fixed: true, width: 150 };
    }
  });
}

export function setFixedParameters(
  fixedRule: string | undefined,
  tableColumns: UnionColumns<Record<string, any>>[],
): UnionColumns<any>[] {
  const actionIndex = tableColumns.findIndex(({ id })=>id === 'action');
  switch (fixedRule) {
  case 'one':
    addFixedParameters([0], tableColumns);
    break;
  case 'previous_two':
    addFixedParameters([0, 1], tableColumns);
    break;
  case 'action':
    if (actionIndex > -1) {
      addFixedParameters([actionIndex], tableColumns);
    }
    break;
  case 'one_action':
    addFixedParameters(actionIndex > -1 ? [0, actionIndex] : [0], tableColumns);
    break;
  }
  return tableColumns;
}

export function getPageDataSchema(
  config: Config,
  schema: Scheme,
  customColumns: UnionColumns<any>[],
): {
  tableColumns: UnionColumns<any>[];
  pageTableShowRule: PageTableShowRule;
} {
  const { pageTableShowRule = {}, pageTableColumns = [] } = config || {};
  const fieldsMap = schema?.properties || {};
  const tableColumns: UnionColumns<any>[] = pageTableColumns.map((key) => {
    return {
      id: key,
      Header: fieldsMap[key].title || '',
      accessor: (data: any) => getTableCellData(data[key], fieldsMap[key]),
    };
  });

  return {
    tableColumns: setFixedParameters(pageTableShowRule.fixedRule, [...tableColumns, ...customColumns]),
    pageTableShowRule,
  };
}

import React from 'react';
import moment from 'moment';
import { UnionColumns } from 'react-table';

import { TableConfig } from './type';

export type Scheme = Record<string, any>;
export type Config = {
  filters?: Filters;
  pageTableColumns?: string[];
  pageTableShowRule?: TableConfig;
};

type Option = {
  value: string;
  label: string;
}

export function getTableCellData(
  initValue: string | string[] | Record<string, unknown> | Record<string, unknown>[] | undefined,
  field: ISchema,
  defaultValue?: any,
): string | JSX.Element | Record<string, any>[] {
  if (!initValue) {
    return defaultValue || undefined;
  }

  const format = field['x-component-props']?.format || 'YYYY-MM-DD HH:mm:ss';
  switch (field.type) {
  case 'label-value':
    return (([] as Record<string, unknown>[]).concat(initValue as Record<string, unknown>[]))
      .map((itm) => itm.label).join(',');
  case 'datetime':
    if (Array.isArray(initValue)) {
      return (initValue as string[]).map((value: string) => {
        return moment(value).format(format);
      }).join('-');
    }
    return moment(initValue).format(format);
  case 'string':
    if (field.enum && field.enum.length) {
      return (field.enum.find(({ value }: any) => value === initValue) as Option)?.label || '';
    }

    return initValue as string;
  case 'array':
    if (field.enum && field.enum.length) {
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

    return (initValue as Option[]).map(({ label })=>label).join(',');
  default:
    if (Array.isArray(initValue)) {
      return initValue.join(',');
    }

    if (typeof initValue === 'object' && initValue?.label) {
      return initValue?.label as string;
    }

    return initValue as string;
  }
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
  const actionIndex = tableColumns.findIndex(({ id }) => id === 'action');
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
  pageTableShowRule: TableConfig;
} {
  const { pageTableShowRule = {}, pageTableColumns = [] } = config || {};
  const fieldsMap = schema?.properties || {};
  const tableColumns: UnionColumns<any>[] = pageTableColumns.map((key) => {
    return {
      id: key,
      Header: fieldsMap[key].title || '',
      accessor: (data: any) => getTableCellData(
        data[key],
        fieldsMap[key],
        <span className='text-gray-300'>——</span>,
      ),
    };
  });

  return {
    tableColumns: setFixedParameters(pageTableShowRule.fixedRule, [...tableColumns, ...customColumns]),
    pageTableShowRule,
  };
}

import React from 'react';
import { UnionColumns } from 'react-table';
import {
  pipe, entries, map, isArray, filter, isUndefined,
} from 'lodash/fp';

import FormDataValueRenderer from '@c/form-data-value-renderer';
import { getCondition } from '@c/data-filter/utils';
import { not } from '@lib/utils';
import { schemaToMap } from '@lib/schema-convert';
import { TableConfig, TableColumnConfig } from './type';
import AppPageDataStore from './store';

export type Scheme = Record<string, any>;
export type Config = {
  filters?: Filters;
  pageTableColumns?: TableColumnConfig[];
  pageTableShowRule?: TableConfig;
};

export const SHOW_FIELD = [
  'DatePicker',
  'Input',
  'MultipleSelect',
  'NumberPicker',
  'RadioGroup',
  'Select',
  'CheckboxGroup',
  'UserPicker',
  'CascadeSelector',
  'OrganizationPicker',
  'AssociatedData',
  'Serial',
  'Textarea',
];

function addFixedParameters(
  fixedList: number[],
  tableColumns: UnionColumns<Record<string, any>>[],
): void {
  fixedList.forEach((index) => {
    if (tableColumns[index]) {
      tableColumns[index] = { ...tableColumns[index], fixed: true };
    }
  });
}

export function setFixedParameters(
  fixedRule: string | undefined,
  tableColumns: UnionColumns<Record<string, any>>[],
): UnionColumns<any>[] {
  switch (fixedRule) {
  case 'one':
    addFixedParameters([0], tableColumns);
    break;
  case 'previous_two':
    addFixedParameters([0, 1], tableColumns);
    break;
  }
  return tableColumns;
}

// 默认列宽
export const DEFAULT_COLUMN_WIDTH = 100;

// 旧数据兼容方法
export function columnStringToObject(pageTableColumns: string[] | TableColumnConfig[]): TableColumnConfig[] {
  if (pageTableColumns.length && typeof pageTableColumns[0] === 'string') {
    return (pageTableColumns as string[]).map((id) => ({ id }));
  }

  return pageTableColumns as TableColumnConfig[];
}

export function getPageDataSchema(
  config: Config,
  schema: ISchema,
): {
  tableColumns: UnionColumns<any>[];
  pageTableShowRule: TableConfig;
} {
  const { pageTableShowRule = {}, pageTableColumns = [] } = config || {};
  const fieldsMap = schemaToMap(schema);
  const _pageTableColumns = columnStringToObject(pageTableColumns);
  const tableColumns: UnionColumns<any>[] = _pageTableColumns.filter(({ id }) => {
    return id in fieldsMap;
  }).map(({ id, width }) => {
    return {
      id,
      width: width || '',
      Header: fieldsMap[id].title || '',
      accessor: (data: any) => {
        if (data[id] === undefined || data[id] === null || data[id] === '') {
          return <span className='text-gray-300'>——</span>;
        }

        return <FormDataValueRenderer value={data[id]} schema={fieldsMap[id]} />;
      },
    };
  });

  return {
    tableColumns: setFixedParameters(pageTableShowRule.fixedRule, tableColumns),
    pageTableShowRule,
  };
}

export function conditionBuilder(store: AppPageDataStore, values: Record<string, unknown>): Condition[] {
  const _conditionBuilder = pipe(
    entries,
    map(([key, value]) => {
      const curFilter = store.fields.find(({ id }) => id === key);
      if (!value || (isArray(value) && value.length === 0) || !curFilter) {
        return;
      }
      return getCondition(curFilter, value, key);
    }),
    filter(not(isUndefined)),
  );

  return _conditionBuilder(values);
}


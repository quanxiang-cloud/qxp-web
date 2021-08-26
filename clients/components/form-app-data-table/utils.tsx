import React from 'react';
import { UnionColumns } from 'react-table';
import {
  pipe, entries, map, isArray, filter, isUndefined,
} from 'lodash/fp';

import FormDataValueRenderer from '@c/form-data-value-renderer';
import { getCondition } from '@c/data-filter/utils';
import { not } from '@lib/utils';
import { schemaToMap } from '@lib/schema-convert';

import { TableConfig } from './type';
import AppPageDataStore from './store';

export type Scheme = Record<string, any>;
export type Config = {
  filters?: Filters;
  pageTableColumns?: string[];
  pageTableShowRule?: TableConfig;
};

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
  schema: ISchema,
  customColumns: UnionColumns<any>[],
): {
  tableColumns: UnionColumns<any>[];
  pageTableShowRule: TableConfig;
} {
  const { pageTableShowRule = {}, pageTableColumns = [] } = config || {};
  const fieldsMap = schemaToMap(schema);
  const tableColumns: UnionColumns<any>[] = pageTableColumns.filter((key) => key in fieldsMap).map((key) => {
    return {
      id: key,
      Header: fieldsMap[key].title || '',
      accessor: (data: any) => {
        if (data[key] === undefined || data[key] === null || data[key] === '') {
          return <span className='text-gray-300'>——</span>;
        }

        return <FormDataValueRenderer value={data[key]} schema={fieldsMap[key]} />;
      },
    };
  });

  return {
    tableColumns: setFixedParameters(pageTableShowRule.fixedRule, [...tableColumns, ...customColumns]),
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

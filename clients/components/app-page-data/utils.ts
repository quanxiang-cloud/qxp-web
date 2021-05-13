import moment from 'moment';

import { getFilterField } from '@portal/modules/apps-management/pages/form-design/utils';
import { UnionColumns } from 'react-table';

import appPageDataStore from './store';
import React from 'react';

export type Scheme = Record<string, any>;
export type PageTableShowRule = {
  fixedRule?: string;
  order?: string;
  pageSize?: number | null;
}
export type Config = {
  filtrate?: PageField[];
  pageTableConfig?: Record<string, any>;
  pageTableShowRule?: PageTableShowRule;
};

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

export function getTableCellData(initValue: string | string[], field: PageField) {
  if (!initValue) {
    return '——';
  }

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
        if (!field.enum) {
          return '';
        }

        return field.enum.find(({ value }: any) => value === _value)?.label || '';
      }).join(',');
    }

    return field.enum.find(({ value }: any) => value === initValue)?.label || '';
  }

  if (Array.isArray(initValue)) {
    return initValue.join(',');
  }

  return initValue;
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
  if (!fixedRule) {
    return tableColumns;
  }

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

export function getPageDataSchema(config: Config, schema: Scheme, pageID: string, pageName?: string) {
  const { pageTableShowRule = {}, pageTableConfig = {}, filtrate = [] } = config || {};
  const { setFiltrates, setTableConfig, setTableColumns, setPageID, setFieldsMap } = appPageDataStore;
  const fieldsMap = schema?.properties || {};
  const tableColumns: any[] = [];
  Object.keys(fieldsMap).forEach((key: string) => {
    const hasVisible = pageTableConfig[key] ? 'visible' in pageTableConfig[key] : false;
    if (key !== '_id' && ((hasVisible && pageTableConfig[key].visible) || !hasVisible)) {
      tableColumns.push({
        id: key,
        Header: fieldsMap[key].title || '',
        accessor: (data: any) => getTableCellData(data[key], fieldsMap[key]),
      });
    }
  });

  if (Object.keys(pageTableConfig).filter((key: string) => 'sort' in pageTableConfig[key]).length > 0) {
    tableColumns.sort((a, b) => {
      return pageTableConfig[a.id]?.sort - pageTableConfig[b.id]?.sort;
    });
  } else {
    tableColumns.sort((a, b) => {
      return fieldsMap[a.id]['x-index'] - fieldsMap[b.id]['x-index'];
    });
  }

  setFiltrates(filtrate.map((field: PageField) => {
    return getFilterField(field);
  }));
  setTableColumns(setFixedParameters(pageTableShowRule.fixedRule, tableColumns));
  setTableConfig(pageTableShowRule);
  setPageID(pageID, pageName);
  setFieldsMap(fieldsMap);
}

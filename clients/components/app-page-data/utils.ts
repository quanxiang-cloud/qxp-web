import moment from 'moment';

import { getFilterField } from '@portal/modules/apps-management/pages/form-design/utils';

import appPageDataStore from './store';

export type Scheme = Record<string, any>;
export type Config = {
  filtrate?: PageField[];
  pageTableConfig?: Record<string, any>;
  pageTableShowRule?: {
    fixedRule?: string;
    order?: string;
    pageSize?: number | null;
  }
};

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

export function getPageDataSchema(config: Config, schema: Scheme, pageID: string, pageName?: string) {
  const { pageTableShowRule = {}, pageTableConfig = {}, filtrate = [] } = config || {};
  const { setFiltrates, setTableConfig, setTableColumns, setPageID, setFieldsMap } = appPageDataStore;
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
    const hasVisible = pageTableConfig[key] ? 'visible' in pageTableConfig[key] : false;
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
  setTableColumns(tableColumns);
  setTableConfig(pageTableShowRule);
  setPageID(pageID, pageName);
  setFieldsMap(fieldsMap);
}

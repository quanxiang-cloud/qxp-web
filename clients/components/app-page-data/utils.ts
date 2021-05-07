import moment from 'moment';

import { getFilterField } from '@portal/modules/apps-management/pages/form-design/utils';

import appPageDataStore from './store';

function getTableCellData(initValue: any, field: any) {
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
        return field.enum.find(({ value }: any) => value === _value)?.label || '';
      }).join(',');
    }

    return field.enum.find(({ value }: any) => value === initValue)?.label || '';
  }

  return initValue;
}

export function getPageDataSchema(config: any, schema: any, pageID: string) {
  const { pageTableShowRule = {}, pageTableConfig, filtrate = [] } = config || {};
  const { setFiltrates, setTableConfig, setTableColumns, setTableID } = appPageDataStore;
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
    const hasVisible = pageTableConfig && pageTableConfig[key] ?
      'visible' in pageTableConfig[key] : false;

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

  if (pageTableConfig) {
    tableColumns.sort((a, b) => {
      return pageTableConfig[a.id]?.sort - pageTableConfig[b.id]?.sort;
    });
  }

  setFiltrates(filtrate.map((field: PageField) => {
    return getFilterField(field);
  }));
  setTableColumns(tableColumns);
  setTableConfig(pageTableShowRule);
  setTableID(pageID);
}
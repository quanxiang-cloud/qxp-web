/* eslint-disable no-empty */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from 'react';
import { Column } from 'react-table';
import { get, isArray, isObject } from 'lodash';
import cs from 'classnames';

import Table from '@c/table';
import Button from '@c/button';
import Icon from '@c/icon';

import FormDataValueRenderer from '@c/form-data-value-renderer';
import { isMeanless } from '@lib/utils';
import schemaToFields, { schemaToMap } from '@lib/schema-convert';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import SelectRecordsModal from './select-records-modal';
import { fetchFormDataList } from '@lib/http-client-form';
import { toEs } from '@c/data-filter/utils';
import moment from 'moment';

type Props = {
  defaultValues: Record<string, any>[];
  appID: string;
  tableID: string;
  columns: string[];
  value: Record<string, any>[];
  multiple: boolean;
  associatedTable: ISchema;
  onChange: (value: Record<string, any>[]) => void;
  filterConfig?: FilterConfig;
  associativeConfig?: any;
  mergeConfig?: any;
  addNewRecords?: boolean;
  readOnly?: boolean;
  className?: string;
}

function computeTableColumns(schema: ISchema, columns: string[]): Column<Record<string, any>>[] {
  return columns.map((fieldKey) => {
    const fieldSchema = get(schemaToMap(schema), fieldKey, { title: '' });
    return {
      id: fieldKey,
      Header: fieldSchema.title || fieldKey,
      accessor: (rowData: Record<string, any>) => {
        if (isMeanless(rowData[fieldKey])) {
          return '无数据';
        }

        return (
          <FormDataValueRenderer schema={fieldSchema} value={rowData[fieldKey]} />
        );
      },
    };
  }).filter(({ id }) => id !== '_id');
}

function AssociatedRecords(props: Props): JSX.Element {
  const {
    defaultValues,
    associatedTable,
    columns,
    value,
    appID,
    tableID,
    multiple,
    onChange,
    filterConfig,
    mergeConfig,
    addNewRecords,
    readOnly,
    className,
  } = props;
  const { selectAll = false } = filterConfig || {};
  const [showSelectModal, setShowSelectModal] = useState(false);
  // const [index, setIndex] = useState(0);
  const [selectedValue, setSelectValue] = useState((multiple || selectAll) ? '' : defaultValues[0]?._id);
  const tableColumns = computeTableColumns(associatedTable, columns);

  const { jumpToHome } = associatedTable?.['x-props'] || {};
  const showFields = tableColumns.filter((item: any)=>item.id !== 'remove')?.map((item: any)=>item.id);

  !readOnly && tableColumns.push({
    id: 'remove',
    Header: '操作',
    accessor: (row) => {
      return (
        <Icon
          changeable
          clickable
          size={24}
          name="delete"
          onClick={() => {
            onChange(value.filter(({ _id }) => {
              const rowId = row._id;
              return isArray(rowId) ? !rowId.includes(_id) : _id !== row._id;
            }));
            setSelectValue('');
          }}
        />
      );
    },
  });

  useEffect(()=>{
    onChange(value);
  }, [JSON.stringify(value)]);

  const mergedArr = Object.values(value.reduce((acc, cur) => {
    let key = showFields.map((item)=>cur[item]).join('-');
    tableColumns?.forEach((column: any)=>{
      if (column.id !== 'remove') {
        const cell: any = column.accessor(cur);
        const { schema = {}, value = '' } = cell?.props || {};
        const { componentName, fieldName } = schema;
        if (componentName === 'datepicker') {
          const { format } = schema?.['x-component-props'] || {};
          if (format) {
            const _val = moment(value).utc().format(format);
            key = showFields.map((item)=>{
              return fieldName === item ? _val : cur[item];
            }).join('-');
          }
        }
      }
    });
    if (!acc[key]) {
      acc[key] = { ...cur };
    } else {
      acc[key]._id = [acc[key]._id, cur._id].flat();
    }
    return acc;
  }, {}));

  const addNewRecord = ()=>{
    window.open(`/_jump_to_home?to=${jumpToHome}`);
  };

  return (
    <div className={cs('w-full', className)}>
      <Table
        className="mb-16"
        rowKey="_id"
        columns={tableColumns}
        data={mergeConfig ? mergedArr : value}
        emptyTips="没有关联记录"
        style={{ maxHeight: 300 }}
      />
      {!readOnly && (
        <Button type="button" onClick={() => setShowSelectModal(true)}>选择关联记录</Button>
      )}
      {
        addNewRecords && jumpToHome &&
        <Button className='ml-10' type="button" onClick={() => addNewRecord()}>新建关联记录</Button>
      }
      {showSelectModal && (
        <SelectRecordsModal
          defaultValues={defaultValues}
          onClose={() => setShowSelectModal(false)}
          appID={appID}
          tableID={tableID}
          filterConfig={filterConfig}
          multiple={multiple || selectAll}
          associatedTable={associatedTable}
          columns={columns}
          selectedValue={selectedValue}
          onSubmit={(newSelectedRecords) => {
            if (multiple || selectAll) {
              const selecteds = value.concat(
                newSelectedRecords.filter(({ _id }) => value.findIndex(({ _id: id }) => _id === id) < 0),
              );
              onChange(selecteds);
            } else {
              onChange(newSelectedRecords);
              setSelectValue(newSelectedRecords[0]?._id);
            }
            setShowSelectModal(false);
          }}
        />
      )}
    </div>
  );
}

function AssociatedRecordsFields(props: Partial<ISchemaFieldComponentProps>): JSX.Element {
  const componentProps = props.props['x-component-props'];

  // todo handle error case
  const [selectAllData, setSelectAllData] = useState<any>([]);
  const [hasChanged, setHasChanged] = useState<any>(false);
  const { selectAll = false } = componentProps?.filterConfig || {};
  const { appID, tableID, isNew } = componentProps;
  const [updateFlag, setUpdateFlag] = useState(!isNew);
  const { condition = [], tag = 'must' } = componentProps.filterConfig || {};
  const [filterConfigIndex, setFilterConfigIndex] = useState(0);
  const getSelectAllData = async ()=>{
    await fetchFormDataList(appID, tableID, {
      sort: ['-created_at'],
      page: 1,
      size: 1000,
      query: toEs({ tag, condition: [...condition] }),
    }).then((res: any)=>{
      setSelectAllData(res?.entities || []);
      setHasChanged(false);
      filterConfigIndex >= 2 && setUpdateFlag(false);
    }).catch((e) => {
      console.log(e);
    });
  };

  useEffect(()=>{
    setFilterConfigIndex(filterConfigIndex + 1);
    selectAll && getSelectAllData();
  }, [JSON.stringify(componentProps?.filterConfig?.condition)]);

  const getValue = ()=>{
    if (props.props.readOnly || !selectAll || hasChanged || updateFlag ) {
      return props.value || [];
    }
    return selectAllData;
  };

  function executeAssignMent(dataRows: any): void {
    const p: any = props;
    const { setFieldState } = p?.form ?? {};
    const associativeConfig = p['x-component-props']?.associativeConfig ||
    p.props['x-component-props'].associativeConfig;
    associativeConfig && associativeConfig?.rules?.forEach((
      { dataSource, dataTarget }: FormBuilder.DataAssignment,
    ) => {
      try {
        const { uniqueShow } = associativeConfig || {};
        const fullPath = p?.path?.split('.');
        const relativePath = fullPath?.slice(0, fullPath.length - 1).join('.');
        setFieldState(`${relativePath}.${dataTarget}`, (state: any) => {
          const associatedTable = p['x-component-props']?.associatedTable ||
        p.props['x-component-props'].associatedTable;
          const _fields = schemaToFields(associatedTable);
          const dateSourceSchema = _fields?.find(({ id }: any)=>id === dataSource);
          let arr = dataRows.map((item: any)=>{
            let val: any = item?.[dataSource];
            if (isObject(val) && !isArray(val)) {
              val = val?.label;
            }
            if (isArray(val)) {
              val = val?.map((item: any)=>{
                const { label } = item || {};
                return label || item;
              })?.filter((item: any)=>!!item);
            }
            if (dateSourceSchema?.componentName === 'datepicker') {
              const { format } = dateSourceSchema?.['x-component-props'] || {};
              val = moment(val).format(format);
            }
            return val;
          })?.filter((item: any)=>!!item);
          arr = arr.flat();
          state.value = uniqueShow ? [...new Set([...arr])]?.join(',') : arr?.join(',');
        });
      } catch (error) {
      }
    });
  }

  return (
    <AssociatedRecords
      className={props.props.className}
      defaultValues={getValue()}
      // defaultValues={props.value || []}
      readOnly={props.props.readOnly}
      appID={componentProps.appID}
      tableID={componentProps.tableID}
      columns={componentProps.columns || []}
      multiple={componentProps.multiple || false}
      filterConfig={componentProps.filterConfig}
      associativeConfig={componentProps?.associativeConfig}
      mergeConfig={componentProps?.mergeConfig}
      addNewRecords={componentProps?.addNewRecords}
      value={getValue()}
      // value={props.value}
      associatedTable={componentProps.associatedTable}
      onChange={(selectedKeys) => {
        setHasChanged(true);
        props?.mutators?.change(selectedKeys);
        executeAssignMent(selectedKeys);
      }}
    />
  );
}

AssociatedRecordsFields.isFieldComponent = true;

export default AssociatedRecordsFields;

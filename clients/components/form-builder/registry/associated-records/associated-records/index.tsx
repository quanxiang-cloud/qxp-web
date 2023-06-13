/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from 'react';
import { Column } from 'react-table';
import { get, isArray } from 'lodash';
import cs from 'classnames';

import Table from '@c/table';
import Button from '@c/button';
import Icon from '@c/icon';

import FormDataValueRenderer from '@c/form-data-value-renderer';
import { isMeanless } from '@lib/utils';
import { schemaToMap } from '@lib/schema-convert';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import SelectRecordsModal from './select-records-modal';
import { fetchFormDataList } from '@lib/http-client-form';
import { toEs } from '@c/data-filter/utils';

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
  mergeConfig?: any;
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

function AssociatedRecords({
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
  readOnly,
  className,
}: Props): JSX.Element {
  const { selectAll = false } = filterConfig || {};
  const [showSelectModal, setShowSelectModal] = useState(false);
  // const [index, setIndex] = useState(0);
  const [selectedValue, setSelectValue] = useState((multiple || selectAll) ? '' : defaultValues[0]?._id);
  const tableColumns = computeTableColumns(associatedTable, columns);

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
    const key = showFields.map((item)=>cur[item]).join('-');
    if (!acc[key]) {
      acc[key] = { ...cur };
    } else {
      acc[key]._id = [acc[key]._id, cur._id].flat();
    }
    return acc;
  }, {}));

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

  useEffect(()=>{
    console.log('updateFlag', updateFlag);
    console.log('filterConfigIndex', filterConfigIndex);
  }, [updateFlag]);
  const getValue = ()=>{
    if (props.props.readOnly || !selectAll || hasChanged || updateFlag ) {
      return props.value || [];
    }
    return selectAllData;
  };

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
      mergeConfig={componentProps?.mergeConfig}
      value={getValue()}
      // value={props.value}
      associatedTable={componentProps.associatedTable}
      onChange={(selectedKeys) => {
        setHasChanged(true);
        props?.mutators?.change(selectedKeys);
      }}
    />
  );
}

AssociatedRecordsFields.isFieldComponent = true;

export default AssociatedRecordsFields;

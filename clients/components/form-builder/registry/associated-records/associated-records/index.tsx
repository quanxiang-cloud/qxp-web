import React, { useEffect, useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Table from '@c/table';
import Button from '@c/button';
import Icon from '@c/icon';
import { Column } from 'react-table';
import { get } from 'lodash';
import { useQuery } from 'react-query';
import { findTableRecords } from './api';
import SelectRecordsModal from './select-records-modal';

type Props = {
  appID: string;
  tableID: string;
  columns: string[];
  multiple: boolean;
  selected: string[];
  associatedTable: ISchema;
  onChange: (selectedKeys: string[]) => void;
}

function computeTableColumns(schema: ISchema, columns: string[]): Column<Record<string, any>>[] {
  return columns.map((fieldKey) => {
    const fieldSchema = get(schema, `properties.${fieldKey}`, {});
    return {
      id: fieldKey,
      Header: fieldSchema.title || fieldKey,
      accessor: fieldKey,
    };
  }).filter(({ id }) => id !== '_id');
}

function AssociatedRecords({ associatedTable, columns, selected, appID, tableID, multiple, onChange }: Props): JSX.Element {
  // todo append operation column
  const [records, setRecords] = useState<Record<string, any>[]>([]);
  const [showSelectModal, setShowSelectModal] = useState(false);
  const { isLoading, data, isError, error } = useQuery([], () => findTableRecords(appID, tableID, selected));

  useEffect(() => {
    setRecords(data || []);
  }, [data]);

  useEffect(() => {
    onChange(records.map(({ _id }) => _id));
  }, [records]);

  const tableColumns = computeTableColumns(associatedTable, columns);
  tableColumns.push({
    id: 'remove',
    Header: '操作',
    accessor: (row) => {
      return (
        <Icon
          changeable
          clickable
          name="delete"
          onClick={() => {
            const _records = records.filter(({ _id }) => _id !== row._id);
            setRecords(_records);
          }}
        />
      );
    },
  });

  if (isLoading) {
    return (<div>loading...</div>);
  }

  if (!data) {
    return (
      <div>some error</div>
    );
  }

  return (
    <div className="w-full">
      <Table
        className="mb-16"
        rowKey="_id"
        columns={tableColumns}
        data={records}
        emptyTips="没有关联记录"
      />
      <Button type="button" onClick={() => setShowSelectModal(true)}>选择关联记录</Button>
      {showSelectModal && (
        <SelectRecordsModal
          onClose={() => setShowSelectModal(false)}
          appID={appID}
          tableID={tableID}
          multiple={multiple}
          associatedTable={associatedTable}
          columns={columns}
          onSubmit={(newSelectedRecords) => {
            const selectedKeys = records.map(({ _id }) => _id);
            const _records = newSelectedRecords.filter(({ _id }) => !selectedKeys.includes(_id));
            setRecords(records.concat(_records));

            setShowSelectModal(false);
          }}
        />
      )}
    </div>
  );
}

function AssociatedRecordsFields(props: ISchemaFieldComponentProps) {
  const componentProps = props.props['x-component-props'];
  // todo handle error case
  return (
    <AssociatedRecords
      appID={componentProps.appID}
      tableID={componentProps.tableID}
      columns={componentProps.columns || []}
      multiple={componentProps.multiple || 'single'}
      selected={componentProps.selected || []}
      associatedTable={componentProps.associatedTable}
      onChange={(selectedKeys) => props.mutators.change(selectedKeys)}
    />
  );
}

AssociatedRecordsFields.isFieldComponent = true;

export default AssociatedRecordsFields;

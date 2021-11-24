import React, { useState } from 'react';
import { Column } from 'react-table';
import { get } from 'lodash';
import cs from 'classnames';

import Table from '@c/table';
import Button from '@c/button';
import Icon from '@c/icon';

import FormDataValueRenderer from '@c/form-data-value-renderer';
import { isEmpty } from '@lib/utils';
import { schemaToMap } from '@lib/schema-convert';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import SelectRecordsModal from './select-records-modal';

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
        if (isEmpty(rowData[fieldKey])) {
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
  readOnly,
  className,
}: Props): JSX.Element {
  const [showSelectModal, setShowSelectModal] = useState(false);
  const tableColumns = computeTableColumns(associatedTable, columns);

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
          onClick={() => onChange(value.filter(({ _id }) => _id !== row._id))}
        />
      );
    },
  });

  return (
    <div className={cs('w-full', className)}>
      <Table
        className="mb-16"
        rowKey="_id"
        columns={tableColumns}
        data={value}
        emptyTips="没有关联记录"
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
          multiple={multiple}
          associatedTable={associatedTable}
          columns={columns}
          onSubmit={(newSelectedRecords) => {
            if (multiple) {
              const selecteds = value.concat(
                newSelectedRecords.filter(({ _id }) => value.findIndex(({ _id: id }) => _id === id) < 0),
              );
              onChange(selecteds);
            } else {
              onChange(newSelectedRecords);
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

  return (
    <AssociatedRecords
      className={props.props.className}
      defaultValues={props.value || []}
      readOnly={props.props.readOnly}
      appID={componentProps.appID}
      tableID={componentProps.tableID}
      columns={componentProps.columns || []}
      multiple={componentProps.multiple || false}
      filterConfig={componentProps.filterConfig}
      value={props.value}
      associatedTable={componentProps.associatedTable}
      onChange={(selectedKeys) => props?.mutators?.change(selectedKeys)}
    />
  );
}

AssociatedRecordsFields.isFieldComponent = true;

export default AssociatedRecordsFields;

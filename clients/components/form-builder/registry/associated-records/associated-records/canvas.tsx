import React from 'react';
import { Column } from 'react-table';
import { get } from 'lodash';
import _, { every, isObject, map, pipe, filter } from 'lodash/fp';

import Button from '@c/button';
import Icon from '@c/icon';
import FormDataValueRenderer from '@c/form-data-value-renderer';
import { isEmpty } from '@lib/utils';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

type Props = {
  appID: string;
  tableID: string;
  columns: string[];
  multiple: boolean;
  selected: string[];
  associatedTable: ISchema;
  onChange: (selectedKeys: string[]) => void;
  readOnly: boolean;
  filterConfig?: FilterConfig;
}

function computeTableColumns(schema: ISchema, columns: string[]): Column<Record<string, any>>[] {
  return columns.map((fieldKey) => {
    const fieldSchema = get(schema, `properties.${fieldKey}`, {});
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
  associatedTable,
  columns,
  selected,
  onChange,
  readOnly,
}: Props): JSX.Element {
  const tableColumns = computeTableColumns(associatedTable, columns);

  tableColumns.push({
    id: 'remove',
    Header: '操作',
    accessor: (row) => {
      return (
        <Icon
          changeable
          clickable
          size={24}
          name="delete"
          onClick={() => onChange(selected.filter((id) => id !== row._id))}
        />
      );
    },
  });

  return (
    <div className="w-full">
      <div className="fake-component">
        <div className="flex space-around fake-component-header">
          {
            tableColumns.map((itm) => <div className="fake-component-item" key={itm.id}>{itm.Header}</div>)
          }
        </div>
      </div>
      {!readOnly && <Button type="button">选择关联记录</Button>}
    </div>

  );
}

function transformValue(value: string[] | Record<string, string> | Record<string, string>[] = []): string[] {
  const getID = _.get('_id');
  const mapToIDArray = pipe(map(getID), filter((id) => !!id));
  const isObjectArray = every(isObject);
  if (isObjectArray(value)) {
    return mapToIDArray(value as Record<string, string>[]);
  }
  if (isObject(value) && getID(value)) {
    return [(value as Record<string, string>)._id];
  }
  return value as string[];
}

function AssociatedRecordsFields(props: Partial<ISchemaFieldComponentProps>): JSX.Element {
  const componentProps = props.props['x-component-props'];
  const selected = transformValue(props.value);
  // todo handle error case

  return (
    <AssociatedRecords
      readOnly={props.props.readOnly}
      appID={componentProps.appID}
      tableID={componentProps.tableID}
      columns={componentProps.columns || []}
      multiple={componentProps.multiple || false}
      filterConfig={componentProps.filterConfig}
      selected={selected}
      associatedTable={componentProps.associatedTable}
      onChange={(selectedKeys) => props?.mutators?.change(selectedKeys)}
    />
  );
}

AssociatedRecordsFields.isFieldComponent = true;

export default AssociatedRecordsFields;

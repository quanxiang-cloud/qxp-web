import React, { ChangeEvent, useEffect, useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { Table } from 'antd';
import { Input, Radio, DatePicker, NumberPicker, Select } from '@formily/antd-components';

import { getFormTableSchema } from '../config/api';
import logger from '@lib/logger';

type Column = {
  title: string;
  dataIndex: string;
  render: any;
}

type Components = typeof components;

const components = {
  input: Input,
  radiogroup: Radio.Group,
  textarea: Input.TextArea,
  datepicker: DatePicker,
  numberpicker: NumberPicker,
  select: Select,
  multipleselect: Select,
};

interface Props extends ISchemaFieldComponentProps {
  props: {
    [key: string]: any;
    ['x-component-props']: {
      columns: string[];
      appID: string;
      tableID: string;
      subordination: 'foreign_table' | 'sub_table';
      tableName: string;
    }
  }
}

function SubTable(compProps: Props) {
  const [schemaData, setSchemaData] = useState<{tableID: string; schema: ISchema} | null>(null);
  const { schema: definedSchema } = compProps;
  const {
    tableID, appID, subordination, columns: definedColumns,
  } = compProps.props['x-component-props'];
  const isFromEmpty = subordination === 'sub_table';
  const isFromForeign = subordination === 'foreign_table';

  useEffect(() => {
    if (!isFromForeign || !appID || !tableID) {
      return;
    }
    getFormTableSchema<{schema: ISchema; tableID: string;}>({ appID, tableID }).then(setSchemaData);
  }, [tableID, appID]);

  const schema = (isFromEmpty ? definedSchema.items : schemaData?.schema) as ISchema;

  let columns = [];

  function buildColumnFromSchema(dataIndex: string, sc: ISchema) {
    const componentName = sc['x-component']?.toLowerCase() as keyof Components;
    const componentProps = sc['x-component-props'] || {};
    if (!components[componentName]) {
      logger.error('component %s is missing in subTable', componentName);
      return null;
    }
    return {
      title: sc.title as string,
      dataIndex,
      render: () => {
        return React.createElement(components[componentName], {
          ...compProps,
          mutators: {
            ...compProps.mutators,
            change: (e: ChangeEvent<HTMLInputElement>) => {
              const v = e?.target?.value || e;
              compProps.value[dataIndex] = v;
              compProps.mutators.change(compProps.value);
            },
          },
          defaultValue: compProps.defaultValue,
          value: compProps.value[dataIndex],
          props: {
            ...compProps.props,
            enum: sc.enum,
            'x-component-props': {
              ...componentProps,
            },
          },
        });
      },
    };
  }

  columns = Object.entries(schema?.properties || {}).reduce((cur: Column[], next) => {
    const [key, sc] = next;
    if ((isFromForeign && !definedColumns.includes(key)) || key === '_id') {
      return cur;
    }
    const newColumn = buildColumnFromSchema(key, sc);
    newColumn && cur.push(newColumn);
    return cur;
  }, []);

  const dataSource = [{ ...(schema?.properties || {}), key: 0 }];

  if (!columns.length || (columns.length === 1 && columns[0]?.dataIndex === '_id')) {
    return null;
  }

  return (
    <Table columns={columns as Column[]} dataSource={dataSource} pagination={false} />
  );
}

SubTable.isFieldComponent = true;

export default SubTable;

import React, { ChangeEvent, useEffect, useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { Table } from 'antd';
import { Input, Radio, DatePicker, NumberPicker, Select } from '@formily/antd-components';
import { isEmpty } from 'lodash';

import { getFormTableSchema } from './api';
import logger from '@lib/logger';

type Column = {
  title: string;
  dataIndex: string;
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
  const { tableID, appID, columns: definedColumns } = compProps.props['x-component-props'];

  useEffect(() => {
    if (!appID || !tableID || !isEmpty((definedSchema.items as ISchema).properties)) {
      setSchemaData(null);
      return;
    }
    getFormTableSchema<{
      schema: ISchema;
      tableID: string;
    }>({ appID, tableID }).then(setSchemaData);
  }, [tableID, appID]);

  const schema = schemaData?.schema || definedSchema.items as ISchema;
  const parsedColumns = (definedColumns?.map((v) => JSON.parse(v)) || []) as Column[];

  const columns = parsedColumns?.map(({ dataIndex, title }: {
    title: string;
    dataIndex: string;
  }) => {
    const sc = schema?.properties?.[dataIndex];
    if (!sc) {
      return null;
    }
    const componentName = sc['x-component']?.toLowerCase() as keyof Components;
    const componentProps = sc['x-component-props'] || {};
    if (!components[componentName]) {
      logger.error('component %s is missing in subTable', componentName);
      return null;
    }

    return {
      title,
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
  }).filter(Boolean);

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

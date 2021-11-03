import React, { JSXElementConstructor, useEffect, useState } from 'react';
import { Rule } from 'rc-field-form/lib/interface';
import { Table } from 'antd';
import { isObject } from 'lodash';
import { useQuery } from 'react-query';
import { ValidatePatternRules } from '@formily/antd';
import { ISchemaFieldComponentProps, IMutators } from '@formily/react-schema-renderer';

import logger from '@lib/logger';
import FormDataValueRenderer from '@c/form-data-value-renderer';
import { isEmpty } from '@lib/utils';
import schemaToFields from '@lib/schema-convert';
import { getTableSchema } from '@lib/http-client';

import { getDefaultValue, schemaRulesTransform } from './utils';
import SubTableList from './list';
import { components } from './components';

import './style.scss';

export type Rules = (ValidatePatternRules | ValidatePatternRules[]) & Rule[];
export type Column = {
  title: string;
  dataIndex: string;
  componentName: string;
  props: Record<string, any>;
  readOnly: boolean;
  rules: Rules;
  schema: ISchema;
  component: JSXElementConstructor<any>;
  dataSource?: any[];
  required?: boolean;
  render?: (value: unknown) => JSX.Element;
}

type Components = typeof components;

interface SubTableState {
  componentColumns: Column[];
  rowPlaceHolder: Record<string, unknown>;
}

function SubTable({
  schema: definedSchema,
  value,
  name,
  mutators,
  props,
}: Partial<ISchemaFieldComponentProps>): JSX.Element | null {
  const [{ componentColumns, rowPlaceHolder }, setSubTableState] = useState<SubTableState>({
    componentColumns: [], rowPlaceHolder: {},
  });

  const {
    subordination, columns, appID, tableID, rowLimit, layout,
  } = definedSchema?.['x-component-props'] || {};
  let schema = definedSchema?.items as ISchema | undefined;
  const isFromForeign = subordination === 'foreign_table';
  const { data } = useQuery(
    ['GET_SUB_TABLE_CONFIG_SCHEMA', appID, tableID],
    () => getTableSchema(appID, tableID),
    { enabled: !!(isFromForeign && tableID && appID) },
  );
  const isInitialValueEmpty = value?.every((v: Record<string, unknown>) => isEmpty(v));
  schema = isFromForeign ? data?.schema : schema;

  useEffect(() => {
    if (!schema) {
      return;
    }
    window[`schema-${definedSchema?.key}`] = schema;
    const rowPlaceHolder = {};
    const componentColumns: Column[] = schemaToFields(schema).reduce((acc: Column[], field) => {
      const isHidden = !field.display;
      if ((isFromForeign && !columns?.includes(field.id)) || field.id === '_id' || isHidden) {
        return acc;
      }
      const newColumn = buildColumnFromSchema(field.id, field);
      if (newColumn) {
        Object.assign(rowPlaceHolder, { [field.id]: getDefaultValue(field) });
        acc.push(newColumn);
      }
      return acc;
    }, []);
    setSubTableState({ componentColumns, rowPlaceHolder });
    isInitialValueEmpty && mutators?.change([rowPlaceHolder]);
    return () => {
      delete window[`schema-${definedSchema?.key}`];
    };
  }, [schema, columns]);

  function buildColumnFromSchema(dataIndex: string, sc: ISchema): Column | null {
    const componentName = sc['x-component']?.toLowerCase() as keyof Components;
    const componentProps = sc['x-component-props'] || {};
    const componentPropsInternal = sc['x-internal'] || {};
    const dataSource = sc?.enum?.filter((option) => !isObject(option) || option?.label !== '');
    if (!components[componentName]) {
      logger.error('component %s is missing in subTable', componentName);
      return null;
    }

    return {
      componentName,
      title: sc.title as string,
      dataIndex,
      component: components[componentName],
      props: {
        ...componentProps,
        ...componentPropsInternal,
        'x-component-props': componentProps,
        'x-internal': componentPropsInternal,
        readOnly: !!sc.readOnly,
      },
      schema: { ...sc, 'x-internal': { ...sc?.['x-internal'], parentFieldId: name } },
      dataSource,
      required: !!sc?.required,
      readOnly: !!sc.readOnly,
      rules: schemaRulesTransform(sc),
      render: (value: any) => {
        if (isEmpty(value)) {
          return <span className='text-gray-300'>——</span>;
        }

        return <FormDataValueRenderer value={value} schema={sc} />;
      },
    };
  }

  function onAddRow(mutators: IMutators): void {
    mutators.push(rowPlaceHolder);
  }

  if (!componentColumns.length) {
    return null;
  }

  if (props.readOnly) {
    return (
      <Table
        pagination={false}
        rowKey="_id"
        columns={componentColumns}
        dataSource={value}
      />
    );
  }

  return (
    <SubTableList
      name={name}
      value={value}
      props={props}
      componentColumns={componentColumns}
      layout={layout}
      rowLimit={rowLimit}
      onAddRow={onAddRow}
      isFromForeign={isFromForeign}
      columns={columns}
      schema={schema}
    />
  );
}

SubTable.isFieldComponent = true;

export default SubTable;

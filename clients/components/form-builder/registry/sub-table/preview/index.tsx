import React, { JSXElementConstructor, useEffect, useState } from 'react';
import { Rule } from 'rc-field-form/lib/interface';
import { isObject } from 'lodash';
import { useQuery } from 'react-query';
import { ValidatePatternRules } from '@formily/antd';
import { ISchemaFieldComponentProps, IMutators } from '@formily/react-schema-renderer';

import logger from '@lib/logger';
import FormDataValueRenderer from '@c/form-data-value-renderer';
import { isMeanless } from '@lib/utils';
import schemaToFields from '@lib/schema-convert';
import { getTableSchema } from '@lib/http-client-form';

import { getDefaultValue, schemaRulesTransform } from './utils';
import SubTableList from './list';
import { components } from './components';
import { fetchFormDataList } from '@lib/http-client-form';

import './style.scss';
import { toEs } from '@c/data-filter/utils';

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
  form,
}: Partial<ISchemaFieldComponentProps>): JSX.Element | null {
  const [{ componentColumns, rowPlaceHolder }, setSubTableState] = useState<SubTableState>({
    componentColumns: [], rowPlaceHolder: {},
  });

  const {
    subordination, columns, appID, tableID, rowLimit, layout,
    defaultAddAllAssociatedData, filterConfig, isNew,
  } = definedSchema?.['x-component-props'] || {};

  let schema = definedSchema?.items as ISchema | undefined;
  const isFromForeign = subordination === 'foreign_table';
  const { data } = useQuery(
    ['GET_SUB_TABLE_CONFIG_SCHEMA', appID, tableID],
    () => getTableSchema(appID, tableID),
    { enabled: !!(isFromForeign && tableID && appID) },
  );
  const isInitialValueEmpty = value?.every((v: Record<string, unknown>) => isMeanless(v));
  schema = isFromForeign ? data?.schema : schema;

  const { subAssociatedFields = [] } = definedSchema?.items?.['x-component-props'] || {};
  useEffect(() => {
    if (!schema) {
      return;
    }
    window[`schema-${definedSchema?.key}`] = schema;
    const rowPlaceHolder = {};
    const componentColumns: Column[] = schemaToFields(schema)?.reduce((acc: Column[], field) => {
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
    if (!subAssociatedFields || subAssociatedFields?.length === 0) {
      const disInitSubRowPlaceHolder = definedSchema?.['x-component-props']?.disInitSubRowPlaceHolder as any;
      if (!disInitSubRowPlaceHolder) {
        isInitialValueEmpty && mutators?.change([rowPlaceHolder]);
      }
    }
    return () => {
      delete window[`schema-${definedSchema?.key}`];
    };
  }, [JSON.stringify(schema || ''), columns, props?.readOnly]);

  const addAllAssociatedData = ()=>{
    if (defaultAddAllAssociatedData) {
      const schema: any = definedSchema?.items || {};
      let _filterConfig: any = {};
      let fieldName: any = '';
      let appID; let associationTableID; let associateddataKey: any;
      for (const key in schema?.properties) {
        if (schema?.properties[key]['x-component'] === 'associateddata') {
          associateddataKey = key;
          _filterConfig = filterConfig || schema?.properties[key]['x-component-props'].filterConfig || {};
          fieldName = schema?.properties[key]['x-component-props'].fieldName || '';
          appID = schema?.properties[key]['x-component-props'].appID;
          associationTableID = schema?.properties[key]['x-component-props'].associationTableID;
        }
      }
      const { condition = [], tag = 'must' } = _filterConfig;
      fetchFormDataList(appID, associationTableID, {
        query: toEs({ tag, condition }),
        sort: [],
        size: 1000,
      }).then((res) => {
        const list = res?.entities || [];
        if (list?.length) {
          mutators?.change([]);
          list.forEach((item, index)=>{
            const _rowPlaceHolder = JSON.parse(JSON.stringify(rowPlaceHolder));
            _rowPlaceHolder[associateddataKey] = {
              label: item?.[fieldName],
              value: item?._id,
            };
            setTimeout(()=>{
              mutators?.push(_rowPlaceHolder);
            });
          });
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  };

  useEffect(()=>{
    isNew && addAllAssociatedData();
  }, [JSON.stringify(filterConfig)]);

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
        readOnly: props.readOnly || !!sc.readOnly,
      },
      schema: { ...sc, 'x-internal': { ...sc?.['x-internal'], parentFieldId: name } },
      dataSource,
      required: !!sc?.required,
      readOnly: props.readOnly || !!sc.readOnly,
      rules: schemaRulesTransform(sc),
      render: (value: any) => {
        if (isMeanless(value)) {
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
      definedSchema={definedSchema}
      mutators={mutators}
      rowPlaceHolder={rowPlaceHolder}
      form={form}
    />
  );
}

SubTable.isFieldComponent = true;

export default SubTable;

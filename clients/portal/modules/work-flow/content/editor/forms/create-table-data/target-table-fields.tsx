import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { pick, pickBy, each, get, set } from 'lodash';

import { getFormFieldSchema } from '@flow/content/editor/forms/api';
import { FormRenderer } from '@c/form-builder';
import { ValueRule, ValueRuleVal } from '@flow/content/editor/type';
import { schemaToMap } from '@lib/schema-convert';
import { getTableSchema } from '@lib/http-client-form';

import CustomField from './custom-field';
import SubTableFields from './sub-table-fields';
import Context from './context';
import { transformSchema } from '../utils';

interface Props {
  appId: string;
  tableId: string;
}

function TargetTableFields({ appId, tableId }: Props): JSX.Element {
  const { data, setData } = useContext(Context);
  const { data: schema, isLoading, isError } = useQuery(['GET_TARGET_TABLE_SCHEMA', tableId, appId],
    getFormFieldSchema, {
      enabled: !!appId && !!tableId,
    });
  const tableSchemaMap = schemaToMap(schema, (currentSchema: SchemaFieldItem) => {
    return currentSchema.componentName !== 'associatedrecords';
  });
  const [schemaToTransform, setSchemaToTransform] = useState({ ...schema, properties: tableSchemaMap });

  useEffect(() => {
    const initSchemaToTransform = { ...schema, properties: tableSchemaMap };
    Promise.all(
      Object.entries(initSchemaToTransform.properties).map(([fieldName, fieldSchema]) => {
        const compProps = get(fieldSchema, 'x-component-props');
        const subordination = get(compProps, 'subordination', '');

        if (subordination === 'foreign_table') {
          const foreignAppId = get(compProps, 'appID', '');
          const foreignTableId = get(compProps, 'tableID', '');
          const foreignTableFields = get(compProps, 'columns', []);
          return getTableSchema(foreignAppId, foreignTableId).then((res) => {
            const foreignTableSchema = res?.schema.properties || {};
            Object.entries(foreignTableSchema).forEach(([foreignKey, foreignSchema]) => {
              if (foreignTableFields.includes(foreignKey)) {
                set(
                  initSchemaToTransform.properties[fieldName],
                  `items.properties.${foreignKey}`, foreignSchema,
                );
              }
            });
          });
        }
      })).then(() => {
      setSchemaToTransform(initSchemaToTransform);
    });
  }, [schema]);

  useEffect(() => {
    const initNormalRequiredFields: Array<string> = [];
    const initSubTableRequiredFields: Array<string> = [];
    Object.entries(schemaToTransform.properties).forEach(([schemaKey, schemaField]) => {
      if (schemaField['x-component'] === 'SubTable') {
        const subProps: ISchema = get(schemaField, 'items.properties', {});
        Object.entries(subProps).forEach(([subKey, subField]) => {
          if (subField?.required) {
            initSubTableRequiredFields.push(`${schemaKey}.createRules[0].${subKey}`);
          }
        });
      } else if (schemaField.required) {
        initNormalRequiredFields.push(schemaKey);
      }
    });
    set(data, 'normalRequiredField', initNormalRequiredFields);
    set(data, 'subTableRequiredField', initSubTableRequiredFields);
    setData(pick(data, 'normalRequiredField', 'subTableRequiredField'));
  }, [schemaToTransform]);

  const getTableIdByFieldKey = (key: string): string => {
    const field = tableSchemaMap[key];
    if (field && field.componentName === 'subtable') {
      return get(field, 'x-component-props.tableID', '');
    }
    return key;
  };

  function getSubtableTypeByKey(key: string): string {
    return get(tableSchemaMap[key], 'x-component-props.subordination', 'sub_table');
  }

  if (data.ref) {
    Object.keys(data.ref).forEach((itm) => {
      set(data, `ref[${itm}].type`, getSubtableTypeByKey(itm));
    });
  }

  const onChangeFixedValue = (values: any): void => {
    const fieldVals = pickBy(values, (v, k) => k.startsWith('field_'));

    // merge schema field value to data.createRule
    each(data.createRule, (v: ValueRule, k: string) => {
      if (fieldVals[k] !== undefined && k.indexOf('@') < 0) {
        Object.assign(v, {
          valueFrom: 'fixedValue',
          valueOf: fieldVals[k],
        });
      }
    });

    // merge sub-table values
    each(fieldVals, (v: ValueRuleVal, k: string) => {
      if (v !== undefined && k.indexOf('@') > 0) {
        const [parentKey, subKey] = k.split('@');
        const tableId = getTableIdByFieldKey(parentKey);
        const type = getSubtableTypeByKey(parentKey);
        const subVal = get(data.ref, parentKey);
        if (subVal) {
          if (subVal.tableId === tableId) {
            // todo：子表单的createRules暂时支持单条数据
            set(subVal, `createRules[0].${subKey}`, {
              valueFrom: 'fixedValue',
              valueOf: v,
            });
          }
        } else {
          set(data, `ref[${parentKey}]`, {
            type,
            tableId,
            createRules: [{
              [subKey]: {
                valueFrom: 'fixedValue',
                valueOf: v,
              },
            }],
          });
        }
      }
    });

    setData(pick(data, 'createRule', 'ref'));
  };

  if (isLoading) {
    return (
      <div>Loading table schema</div>
    );
  }

  if (isError) {
    return (
      <div>Load table schema failed</div>
    );
  }

  const renderNormalFields = (): JSX.Element => {
    return (
      <FormRenderer
        schema={transformSchema(schemaToTransform, {}, data.createRule)}
        onFormValueChange={onChangeFixedValue}
        additionalComponents={{ CustomField }}
        defaultValue={data}
      />
    );
  };

  const renderSubTableFields = (): JSX.Element | null => {
    const subTableFields = transformSchema(schemaToTransform, { filterSubTable: true }, data.ref);
    if (!Object.keys(subTableFields?.properties || {}).length) {
      return null;
    }

    return (
      <FormRenderer
        schema={subTableFields}
        onFormValueChange={onChangeFixedValue}
        additionalComponents={{ CustomField, SubTableFields }}
        defaultValue={data}
      />
    );
  };

  return (
    <div className="flex flex-col mt-20">
      {renderNormalFields()}
      {renderSubTableFields()}
    </div>
  );
}

export default TargetTableFields;

import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { pick, pickBy, each } from 'lodash';

import { getFormFieldSchema } from '@flow/detail/content/editor/forms/api';
import { FormRenderer } from '@c/form-builder';
import { ValueRule } from '@flowEditor/type';

import CustomField from './custom-field';
import SubTableFields from './sub-table-fields';
import Context from './context';
import { transformSchema } from '../utils';

interface Props {
  appId: string;
  tableId: string;
}

function TargetTableFields({ appId, tableId }: Props) {
  const { data, setData } = useContext(Context);
  const { data: tableSchema, isLoading, isError } = useQuery(['GET_TARGET_TABLE_SCHEMA', tableId, appId], getFormFieldSchema, {
    enabled: !!appId && !!tableId,
  });

  const onChangeFixedValue = (values: any) => {
    console.log('change fixed vals: ', values);
    const fieldVals = pickBy(values, (v, k) => k.startsWith('field_'));
    // merge schema field value to data context
    each(data.createRule, (v: ValueRule, k: string) => {
      if (fieldVals[k] !== undefined) {
        Object.assign(v, {
          valueFrom: 'fixedValue',
          valueOf: fieldVals[k],
        });
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

  const renderNormalFields = () => {
    return (
      <FormRenderer
        schema={transformSchema(tableSchema as ISchema, {}, data.createRule)}
        onFormValueChange={onChangeFixedValue}
        additionalComponents={{ CustomField }}
        defaultValue={data}
      />
    );
  };

  const renderSubTableFields = () => {
    const subTableFields = transformSchema(tableSchema as ISchema, { filterSubTable: true }, data.ref);
    // console.log('subtable fields: ', subTableFields);

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

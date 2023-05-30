import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { FormEffectHooks, useFormEffects } from '@formily/antd';
import schemaToFields from '@lib/schema-convert';
import { SHOW_FIELD } from '@c/form-app-data-table/utils';

const { Option: SelectOption } = Select;
const { onFieldValueChange$ } = FormEffectHooks;

function getTableFields(linkedTableSchema: ISchema): Array<{ fieldKey: string, fieldName: string; }> {
  return schemaToFields(linkedTableSchema, (schema) => {
    if (schema.id === '_id') {
      return false;
    }

    return SHOW_FIELD.includes(schema['x-component'] || '');
  }).map(({ id, title }) => {
    return {
      fieldKey: id,
      fieldName: (title || id) as string,
    };
  });
}
const MergeConfig = (props: any) => {
  const [options, setOptions] = useState([]);
  const [linkedTableFields, setTableFields] = useState<Array<{ fieldKey: string; fieldName: string; }>>([]);
  const [columns, setColumns] = useState<any>([]);

  useEffect(() => {
    const { associatedTable } = props.form.getFieldValue('linkedTable') || {};
    if (associatedTable) {
      setTableFields(getTableFields(associatedTable));
    }
  }, []);

  useFormEffects(() => {
    onFieldValueChange$('linkedTable').subscribe(({ value }) => {
      if (!value) {
        return;
      }

      setTableFields(getTableFields(value.associatedTable));
    });

    onFieldValueChange$('columns').subscribe(({ value }) => {
      if (!value) {
        return;
      }
      setColumns(value);
    });
  });

  useEffect(()=>{
    if (linkedTableFields?.length) {
      const _option = columns?.filter((item: string)=>item !== '_id')?.map((item: string)=>{
        const _field = linkedTableFields?.find(({ fieldKey })=>fieldKey === item);
        return _field ? {
          label: _field?.fieldName,
          value: _field?.fieldKey,
        } : null;
      }).filter((item: any)=>!!item);
      setOptions(_option);
    }
  }, [linkedTableFields, columns]);

  const handleChange = (data: any)=>{
    props.mutators.change(data ? [data] : []);
  };

  return (
    <Select
      {...props}
      allowClear
      options={undefined}
      onChange={handleChange}
    >
      {
        options?.map((opt: any) => (
          <SelectOption key={opt?.value} value={opt?.value}>
            {opt?.label}
          </SelectOption>
        ))
      }
    </Select>
  );
};

MergeConfig.isFieldComponent = true;

export default MergeConfig;

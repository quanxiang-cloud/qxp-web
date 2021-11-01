import React, { useContext, useState } from 'react';

import Select from '@c/select';
import IconBtn from '@c/icon-btn';
import { getSchemaFields, isFieldTypeMatch, getFieldValuePath } from '../../utils';
import { Condition } from './index';
import FlowSourceTableContext from '@flow/content/editor/forms/flow-source-table';

interface Props {
  targetSchema: Record<string, SchemaFieldItem>;
  condition: Condition;
  onRemove: () => void;
  onChange: (data: Partial<Condition>) => void;
}

const operators = [
  { label: '等于', value: 'eq' },
  { label: '不等于', value: 'neq' },
  { label: '包含', value: 'in' },
  { label: '不包含', value: 'nin' },
];

function ConditionItem(props: Props): JSX.Element {
  const [item, setItem] = useState<Condition>(props.condition);
  const { tableSchema: curTableSchema } = useContext(FlowSourceTableContext);

  const onChange = (val: Partial<Condition> = {}): void => {
    setItem((v) => ({ ...v, ...val }));
    const params = { ...val };
    if (val.fieldName) {
      // extend target fieldName with value path
      const fieldSchema = props.targetSchema[val.fieldName];
      const valuePath = getFieldValuePath(fieldSchema);
      params.fieldName = valuePath ? [val.fieldName, valuePath].join('.') : val.fieldName;
    }
    if (val.value && typeof val.value === 'string') {
      // extend source value with value path
      const fieldSchema = curTableSchema.find((v)=> v.fieldName === val.value);
      const valuePath = getFieldValuePath(fieldSchema);
      params.value = valuePath ? [val.value, valuePath].join('.') : val.value;
    }
    props.onChange(params);
  };

  const normalizeFieldName = item.fieldName.split('.')[0];
  const normalizeFieldValue = typeof item.value === 'string' ? item.value.split('.')[0] : item.value;

  return (
    <div className="flex items-center mb-10">
      <span className="text-caption">目标字段:</span>
      <Select
        options={getSchemaFields(Object.values(props.targetSchema), { excludeComps: ['associatedrecords'] })}
        value={normalizeFieldName}
        onChange={(fieldName: string) => onChange({ fieldName } as Condition)}
      />
      <Select
        options={operators}
        value={item.operator}
        onChange={(operator: string) => onChange({ operator } as Condition)}
        className="mx-10"
      />
      <Select
        options={getSchemaFields(curTableSchema, { matchTypeFn: (schema: ISchema)=> {
          const field = props.targetSchema[normalizeFieldName];
          if (!field) {
            return false;
          }
          return isFieldTypeMatch(field.type || 'string', field.componentName, schema);
        } })}
        value={normalizeFieldValue as any}
        onChange={(value: string) => onChange({ value } as Condition)}
      />
      <IconBtn iconName="delete" className="ml-8" onClick={props.onRemove} />
    </div>
  );
}

export default ConditionItem;

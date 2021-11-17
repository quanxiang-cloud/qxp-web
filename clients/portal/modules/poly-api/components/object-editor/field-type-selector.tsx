import React from 'react';

import SelectValue from '../select-value';

interface Props {
  type: POLY_API.API_FIELD_TYPE;
  onChange?: (value: POLY_API.API_FIELD_TYPE) => void;
  simple?: boolean;
  complexity?: boolean;
  rule? : boolean;
}

const complexityTypes: LabelValue[] = [
  {
    name: '对象',
    value: 'object',
  },
  {
    name: '数组',
    value: 'array',
  },
];

const simpleTypes: LabelValue[] = [
  {
    name: '字符串',
    value: 'string',
  },
  {
    name: '数字',
    value: 'number',
  },
  {
    name: '布尔',
    value: 'boolean',
  },
];

const ruleTypes: LabelValue[] = [
  {
    name: '表达式',
    value: 'direct_expr',
  },
];

type LabelValue = {
  name: string;
  value: POLY_API.API_FIELD_TYPE;
}
function FieldTypeSelector({ type, onChange, simple, complexity, rule }: Props): JSX.Element {
  const types = [];
  simple && types.push(...simpleTypes);
  complexity && types.push(...complexityTypes);
  rule && types.push(...ruleTypes);

  return (
    <SelectValue<LabelValue>
      options={types}
      onChange={({ value }) => onChange?.(value)}
      value={types.find(({ value }) => value === type)}
      titleIndex='name'
      valueIndex='value'
    />
  );
}

export default FieldTypeSelector;

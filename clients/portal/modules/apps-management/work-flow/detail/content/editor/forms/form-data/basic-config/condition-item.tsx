import React, { useState, useEffect } from 'react';

import Select from '@c/select';

import { Options } from '@flowEditor/forms/api';
import type { Operator, TriggerConditionExpressionItem } from '@flowEditor/type';

interface Props {
  condition: {
    key: string;
    op: Operator;
    value: string;
  };
  options: Options;
  onChange: (value: Partial<TriggerConditionExpressionItem>) => void;
}

export type ConditionItemOptions = Options;
export type FieldOperatorOptions = {
  label: string;
  value: Operator;
  exclude?: string[];
}[]

export default function ConditionItem({ condition, options, onChange }: Props): JSX.Element {
  const [value, setValue] = useState(condition.key);
  const operatorOptions: FieldOperatorOptions = [{
    label: '大于',
    value: 'gt',
    exclude: ['string'],
  }, {
    label: '等于',
    value: 'eq',
  }, {
    label: '小于',
    value: 'lt',
    exclude: ['string'],
  }, {
    label: '不等于',
    value: 'neq',
  }];
  const currentOption = options.find((option) => option.value === value);

  function onFieldChange(value: string): void {
    setValue(value);
    onChange({ key: value });
  }

  function fieldOperatorOptionsFilter(operatorOptions: FieldOperatorOptions, fieldType = ''): {
    label: string; value: Operator; exclude?: string[] | undefined;
  }[] {
    return operatorOptions.filter(({ exclude }) => !exclude?.includes(fieldType));
  }

  const filteredOperatorOptions = fieldOperatorOptionsFilter(operatorOptions, currentOption?.type);

  useEffect(() => {
    if (!filteredOperatorOptions.find(({ value }) => value === condition.op)) {
      onChange({ op: '' });
    }
  }, [filteredOperatorOptions.length]);

  return (
    <>
      <Select
        placeholder="选择工作表中的字段"
        value={value}
        onChange={onFieldChange}
        className="h-32 border border-gray-300 corner-2-8-8-8
              px-12 text-12 flex items-center flex-1 mb-8"
        options={options}
      />
      <div className="flex flex-row justify-between items-center mb-12">
        <Select
          placeholder="判断符"
          defaultValue={condition.op}
          onChange={(v : Operator) => onChange({ op: v })}
          className="h-32 border border-gray-300 corner-2-8-8-8
              px-12 text-12 flex items-center flex-1 mr-12"
          options={filteredOperatorOptions}
        />
        <input
          className="input"
          defaultValue={condition.value}
          onChange={(e) => onChange({ value: e.target.value })}
        />
      </div>
    </>
  );
}

import React from 'react';

import Select from '@c/select';

import type {
  Operator,
  TriggerConditionExpressionItem,
} from '@flow/detail/content/editor/type';

import { Options } from '@flow/detail/content/editor/forms/api';

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

export default function ConditionItem({ condition, options, onChange }: Props) {
  const operatorOptions: {label: string; value: Operator}[] = [{
    label: '大于',
    value: 'gt',
  }, {
    label: '等于',
    value: 'eq',
  }, {
    label: '小于',
    value: 'lt',
  }, {
    label: '不等于',
    value: 'neq',
  }];

  return (
    <>
      <Select
        placeholder="选择工作表中的字段"
        defaultValue={condition.key}
        onChange={(v: string) => onChange({ key: v })}
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
          options={operatorOptions}
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

import React from 'react';

import Select from '@c/select';

import {
  Operator,
  updateTriggerConditionField,
} from '../../../store';

export type ConditionItemOptions = {
  label: string;
  value: string;
}[]

interface Props {
  condition: {
    key: string;
    op: Operator;
    value: string;
  };
  options: ConditionItemOptions;
}

export default function ConditionItem({ condition, options }: Props) {
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
        onChange={(v: string) => {
          updateTriggerConditionField(condition, {
            key: v,
          });
        }}
        className="h-32 border border-gray-300 input-border-radius
              px-12 text-12 flex items-center flex-1 mb-8"
        options={options}
      />
      <div className="flex flex-row justify-between items-center mb-12">
        <Select
          placeholder="判断符"
          defaultValue={condition.op}
          onChange={(v : Operator) => {
            updateTriggerConditionField(condition, {
              op: v,
            });
          }}
          className="h-32 border border-gray-300 input-border-radius
              px-12 text-12 flex items-center flex-1 mr-12"
          options={operatorOptions}
        />
        <input
          className="input"
          defaultValue={condition.value}
          onChange={(e) => {
            updateTriggerConditionField(condition, {
              value: e.target.value,
            });
          }}
        />
      </div>
    </>
  );
}

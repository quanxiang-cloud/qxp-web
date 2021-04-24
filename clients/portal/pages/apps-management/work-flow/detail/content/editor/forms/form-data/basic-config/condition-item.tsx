import React from 'react';

import Select from '@c/select';

import {
  Condition,
  updateTriggerConditionField,
} from '../../../store';

export type ConditionItemOptions = {
  label: string;
  value: string;
}[]

interface Props {
  condition: Condition;
  options: ConditionItemOptions;
}

export default function ConditionItem({ condition, options }: Props) {
  const operatorOptions = [{
    label: '大于',
    value: '>',
  }, {
    label: '等于',
    value: '=',
  }, {
    label: '小于',
    value: '<',
  }, {
    label: '不等于',
    value: '!=',
  }];

  return (
    <>
      <Select
        placeholder="选择工作表中的字段"
        defaultValue={condition.fieldValue}
        onChange={(v: string) => {
          updateTriggerConditionField(condition, {
            fieldValue: v,
            fieldName: options.find(({ value }) => value === v)?.label || '',
          });
        }}
        className="h-32 border border-gray-300 select-border-radius
              px-12 text-12 flex items-center flex-1 mb-8"
        options={options}
      />
      <div className="flex flex-row justify-between items-center mb-12">
        <Select
          placeholder="判断符"
          defaultValue={condition.operator}
          onChange={(v : string) => {
            updateTriggerConditionField(condition, {
              operator: v,
            });
          }}
          className="h-32 border border-gray-300 select-border-radius
              px-12 text-12 flex items-center flex-1 mr-12"
          options={operatorOptions}
        />
        <input
          className="input"
          defaultValue={condition.operatorValue}
          onChange={(e) => {
            updateTriggerConditionField(condition, {
              operatorValue: e.target.value,
            });
          }}
        />
      </div>
    </>
  );
}

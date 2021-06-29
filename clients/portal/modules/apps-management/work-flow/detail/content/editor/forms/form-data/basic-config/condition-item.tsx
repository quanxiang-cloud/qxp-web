import React, { useState, useEffect } from 'react';
import { omit, noop } from 'lodash';
import cs from 'classnames';
import { useCss } from 'react-use';

import Select from '@c/select';

import { Options } from '@flowEditor/forms/api';
import type { Operator, TriggerConditionExpressionItem } from '@flowEditor/type';
import FormRender from '@c/form-builder/form-renderer';

interface Props {
  condition: {
    key: string;
    op: Operator;
    value: string;
  };
  options: Options;
  schemaMap?: SchemaProperties;
  onChange: (value: Partial<TriggerConditionExpressionItem>) => void;
}

export type ConditionItemOptions = Options;
export type FieldOperatorOptions = {
  label: string;
  value: Operator;
  exclude?: string[];
}[]

export default function ConditionItem({ condition, options, onChange, schemaMap }: Props): JSX.Element {
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
  const currentSchema = schemaMap?.[value || ''] || {};
  const schema = {
    type: 'object',
    title: '',
    description: '',
    properties: {
      [value]: omit(currentSchema, 'title') as SchemaProperties,
    },
  };

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

  function handleChange(value: Record<string, string>): void {
    onChange({ value: Object.values(value)[0] });
  }

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
      <div
        className={cs(
          'flex flex-row justify-between items-center mb-12 condition-item',
          useCss({
            '.ant-form-item': {
              marginBottom: 0,
            },
          }),
        )}
      >
        <Select
          placeholder="判断符"
          defaultValue={condition.op}
          onChange={(v : Operator) => onChange({ op: v })}
          className="h-32 border border-gray-300 corner-2-8-8-8
              px-12 text-12 flex items-center flex-1 mr-12"
          options={filteredOperatorOptions}
        />
        {!value ? (
          <input
            className="input"
            defaultValue={condition.value}
            onChange={noop}
          />
        ) : (
          <FormRender
            defaultValue={{ [value]: condition.value }}
            onFormValueChange={handleChange}
            schema={schema}
          />
        )}
      </div>
    </>
  );
}

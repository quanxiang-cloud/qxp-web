/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect } from 'react';
import { omit, isArray, isEmpty, isEqual } from 'lodash';
import cs from 'classnames';
import { useCss } from 'react-use';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';

import Select from '@c/select';
import { FormFieldOption } from '@newFlow/content/editor/forms/api';
import type {
  Operator,
  TriggerConditionExpressionItem,
  FieldOperatorOptions,
  TriggerConditionValue,
} from '@newFlow/content/editor/type';
import FormRender from '@c/form-builder/form-renderer';
import { COMPONENT_OPERATORS_MAP, OPERATOR_OPTIONS } from '@newFlow/content/editor/utils/constants';
import { getFieldValuePath } from '@newFlow/content/editor/forms/utils';
import { RangeValue } from 'rc-picker/lib/interface';

const { RangePicker } = DatePicker;

interface Props {
  condition: TriggerConditionValue;
  options: FormFieldOption[];
  schemaMap?: Record<string, SchemaFieldItem>;
  onChange: (value: Partial<TriggerConditionExpressionItem>) => void;
}

export type ConditionItemOptions = FormFieldOption[];

export default function ConditionItem({ condition, options, onChange, schemaMap }: Props): JSX.Element {
  const value = condition.key.split('.')[0]; // key maybe like: `field_x.value`, or `field_x.[].value`
  const currentOption = options.find((option) => option.value === value);

  const currentSchema: SchemaFieldItem | Record<string, any> = schemaMap?.[value || ''] || {};
  if (value && !isEmpty(currentSchema)) {
    currentSchema.display = true;
    currentSchema.readOnly = false;
  }

  const schema: ISchema = {
    type: 'object',
    title: '',
    description: '',
    properties: {
      [value]: omit(currentSchema, 'title') as ISchema,
    },
  };

  function onFieldChange(value: string): void {
    const valuePath = getFieldValuePath(schemaMap?.[value]);
    onChange({ key: valuePath ? [value, valuePath].join('.') : value, value: '' });
  }

  function fieldOperatorOptionsFilter(
    operatorOptions: FieldOperatorOptions, currentOption?: FormFieldOption,
  ): {
    label: string; value: Operator; exclude?: string[] | undefined;
  }[] {
    const operators = COMPONENT_OPERATORS_MAP[
      schemaMap?.[currentOption?.value || '']
        ?.['x-component']?.toLowerCase() as keyof typeof COMPONENT_OPERATORS_MAP
    ] || COMPONENT_OPERATORS_MAP.default;
    return operatorOptions.filter(({ value }) => operators.includes(value));
  }

  const filteredOperatorOptions = fieldOperatorOptionsFilter(OPERATOR_OPTIONS, currentOption);

  useEffect(() => {
    if (!filteredOperatorOptions.find(({ value }) => value === condition.op)) {
      onChange({ op: '', value: '' });
    }
  }, [filteredOperatorOptions.length]);

  function handleChange(value: Record<string, string>): void {
    onChange({ value: Object.values(value)[0] });
  }

  const showDateRange = condition.op === 'range';
  const hiddenInput = condition.op === 'null' || condition.op === 'not-null' || showDateRange;
  const dateFormat = currentSchema?.['x-component-props']?.format || 'YYYY-MM-DD';
  let rangePickerDefaultValue: [Moment, Moment] | undefined = undefined;
  if (currentSchema.componentName === 'datepicker' && isArray(condition.value) &&
    !isEqual(condition.value, ['', ''])) {
    rangePickerDefaultValue = condition.value?.map?.((v) => {
      return moment(v);
    }) as unknown as typeof rangePickerDefaultValue;
  }
  // always render radio group as select
  if (currentSchema.componentName === 'radiogroup') {
    Object.assign(schema.properties?.[value], {
      componentName: 'select',
      'x-component': 'Select',
    });
  }

  const formatISODate = (value: string | number | Date, dateFormat: any)=>{
    const now = new Date();
    const Year = now.getFullYear();
    const Month = now.getMonth() + 1;
    const Day = now.getDay();
    const Hours = now.getHours();
    const Minutes = now.getMinutes();
    const Seconds = now.getSeconds();

    if (value) {
      const _year = new Date(value).getFullYear();
      const _month = new Date(value).getMonth() + 1;
      const _day = new Date(value).getDate();
      const _hours = new Date(value).getHours();
      const _minutes = new Date(value).getMinutes();
      const _seconds = new Date(value).getSeconds();

      switch (dateFormat) {
      case 'YYYY':
        return new Date(`${_year}-${Month}-${Day} ${Hours}:${Minutes}:${Seconds}`).toISOString();
      case 'YYYY-MM':
        return new Date(`${_year}-${_month}-${Day} ${Hours}:${Minutes}:${Seconds}`).toISOString();
      case 'YYYY-MM-DD':
        return new Date(`${_year}-${_month}-${_day} ${Hours}:${Minutes}:${Seconds}`).toISOString();
      case 'YYYY-MM-DD HH':
        return new Date(`${_year}-${_month}-${_day} ${_hours}:${Minutes}:${Seconds}`).toISOString();
      case 'YYYY-MM-DD HH:mm':
        return new Date(`${_year}-${_month}-${_day} ${_hours}:${_minutes}:${Seconds}`).toISOString();
      case 'YYYY-MM-DD HH:mm:ss':
        return new Date(`${_year}-${_month}-${_day} ${_hours}:${_minutes}:${_seconds}`).toISOString();
      default:
        return new Date(`${_year}-${_month}-${_day} ${Hours}:${Minutes}:${Seconds}`).toISOString();
      }
    } else {
      return '';
    }
  };

  const handleRangePickerChange = (_: RangeValue<moment.Moment>, value: any[])=>{
    const newValue = value.map((item: any)=>formatISODate(item, dateFormat));
    onChange({ value: newValue });
  };

  return (
    <>
      <Select
        placeholder="选择工作表中的字段"
        value={value}
        onChange={onFieldChange}
        className="h-32 border border-gray-300 corner-2-8-8-8
              px-12 text-12 flex items-center flex-1 mb-8"
        options={options}
        style={{ maxWidth: 'unset' }}
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
          value={condition.op}
          onChange={(v: Operator) => onChange({ op: v })}
          className={cs(
            'h-32 border border-gray-300 corner-2-8-8-8 px-12 text-12 flex items-center flex-1', {
              'mr-12': !hiddenInput || showDateRange,
            })}
          options={filteredOperatorOptions}
          style={{ minWidth: 85 }}
        />
        {!hiddenInput && (
          <>
            {!value ? (
              <input
                className="input"
                value={condition.value}
                onChange={(e) => onChange({ value: e.target.value })}
              />
            ) : (
              <FormRender
                key={condition.key}
                defaultValue={{ [value]: condition.value }}
                onFormValueChange={handleChange}
                schema={schema}
                className='min-w-120'
              />
            )}
          </>
        )}
        {showDateRange && (
          <RangePicker
            {...(currentSchema?.['x-component-props'])}
            format={dateFormat}
            value={rangePickerDefaultValue || []}
            onChange={(_, value: string[]) => handleRangePickerChange(_, value)}
          />
        )}
      </div>
    </>
  );
}

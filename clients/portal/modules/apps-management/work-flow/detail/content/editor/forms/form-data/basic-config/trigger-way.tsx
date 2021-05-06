import React, {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  forwardRef,
  Ref,
} from 'react';

import Select from '@c/select';

import { ConditionItemOptions } from './condition-item';
import { TriggerWay, TriggerWayValue } from '../../../store';

export default forwardRef(function TriggerWay(
  props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    triggerWayValue: { triggerWay: TriggerWay; whenAlterFields: string[]; };
    formFieldOptions: ConditionItemOptions;
    onValueChange: (arg: { triggerWay?: TriggerWay; whenAlterFields?: string[]; }) => void;
  },
  ref?: Ref<HTMLInputElement>,
) {
  const { formFieldOptions, onValueChange, triggerWayValue, ...inputProps } = props;
  const { triggerWay, whenAlterFields } = triggerWayValue;

  function onTypeChange(name: TriggerWayValue) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const { checked } = e.target;
      let newTriggerWay = triggerWay;
      if (checked && !triggerWay.includes(name)) {
        newTriggerWay = [...triggerWay, name];
      }
      if (!checked) {
        newTriggerWay = triggerWay.filter((way) => way !== name);
      }
      if (!newTriggerWay.includes('whenAlter')) {
        return onValueChange({ triggerWay: newTriggerWay, whenAlterFields: [] });
      }
      onValueChange({ triggerWay: newTriggerWay });
    };
  }

  return (
    <div className="mb-24 flex flex-col">
      <div className="mb-8">触发方式</div>
      <label htmlFor="whenAdd" className="mb-8 inline-flex items-center cursor-pointer self-start">
        <input
          {...inputProps}
          ref={ref}
          className="mr-6 checkbox__input"
          name="triggerWay"
          id="whenAdd"
          type="checkbox"
          value="whenAdd"
          onChange={onTypeChange('whenAdd')}
          checked={triggerWay.includes('whenAdd')}
        />
          新增数据时
      </label>
      {triggerWay.includes('whenAdd') && (
        <span className="pl-22 mb-8">新增工作表时，触发工作流</span>
      )}
      <label htmlFor="whenAlter" className="inline-flex items-center cursor-pointer self-start">
        <input
          {...inputProps}
          ref={ref}
          className="mr-6 checkbox__input"
          name="triggerWay"
          id="whenAlter"
          type="checkbox"
          value="whenAlter"
          onChange={onTypeChange('whenAlter')}
          checked={triggerWay.includes('whenAlter')}
        />
          修改数据时
      </label>
      {triggerWay.includes('whenAlter') && (
        <Select<string>
          placeholder="选择工作表中的字段"
          value={whenAlterFields}
          multiple
          onChange={(v: string[]) => onValueChange({ whenAlterFields: v })}
          className="h-32 py-4 border border-gray-300 input-border-radius
                px-12 text-12 flex items-center flex-1 mb-8 ml-22 mt-8"
          options={formFieldOptions}
        />
      )}
    </div>
  );
});

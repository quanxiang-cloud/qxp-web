import React, {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  forwardRef,
  Ref,
} from 'react';
import cs from 'classnames';

import Select from '@c/select';
import useObservable from '@lib/hooks/use-observable';
import store from '@flow/detail/content/editor/store';
import type { StoreValue, TriggerWayValue, TriggerValue } from '@flow/detail/content/editor/type';

import { ConditionItemOptions } from './condition-item';

export default forwardRef(function TriggerWay(
  props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    triggerWayValue: TriggerValue;
    formFieldOptions: ConditionItemOptions;
    onValueChange: (arg: TriggerValue) => void;
  },
  ref?: Ref<HTMLInputElement>,
) {
  const { validating } = useObservable<StoreValue>(store);
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
      onValueChange({ triggerWay: newTriggerWay, whenAlterFields });
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
      {!!formFieldOptions.length && (
        <>
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
            <>
              <Select<string>
                placeholder="选择工作表中的字段"
                value={whenAlterFields}
                multiple
                onChange={(v: string[]) => onValueChange({ whenAlterFields: v, triggerWay })}
                className={cs(
                  'h-32 py-4 border corner-2-8-8-8 px-12 text-12 flex items-center',
                  'flex-1 mb-8 ml-22 mt-8', {
                    'border-gray-300': !validating || whenAlterFields?.length,
                    'border-red-600': validating && !whenAlterFields?.length,
                  })}
                options={formFieldOptions}
              />
              <span className={cs('ml-22', {
                'text-caption': !validating || whenAlterFields?.length,
                'text-caption-no-color text-red-600': validating && !whenAlterFields?.length,
              })}>
                {
                  validating && !whenAlterFields?.length ?
                    '请选择工作表中的字段' :
                    '修改已有工作表中的指定数据时，触发工作流。若不指定则表示修改任意字段均可触发'
                }
              </span>
            </>
          )}
        </>
      )}
      {validating && !triggerWay?.length && (
        <div className={cs('text-caption-no-color text-red-600', {
          'mt-8': !!formFieldOptions.length,
        })}>请至少选择一种触发方式</div>
      )}
    </div>
  );
});

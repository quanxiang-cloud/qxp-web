import React, {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  forwardRef,
  Ref,
  useEffect,
} from 'react';

import Select from '@c/select';

import { ConditionItemOptions } from './condition-item';
import { CurrentElement, updateDataField } from '../../../store';

export default forwardRef(function(
  props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    currentElement: CurrentElement;
    formFieldOptions: ConditionItemOptions;
  },
  ref?: Ref<HTMLInputElement>,
) {
  const { currentElement, formFieldOptions, ...inputProps } = props;
  const { triggerWay } = currentElement.data;
  useEffect(() => {
    if (triggerWay === 'whenAdd') {
      updateDataField('formData', 'whenAlterFields', () => []);
    }
  }, [triggerWay]);

  function onChange(name: string) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        updateDataField('formData', 'triggerWay', () => name);
      }
    };
  }

  return (
    <div className="mb-24 flex flex-col">
      <div className="mb-8">触发方式</div>
      <label htmlFor="whenAdd" className="mb-4 inline-flex items-center cursor-pointer self-start">
        <input
          {...inputProps}
          ref={ref}
          className="mr-6 checkbox__input"
          name="triggerWay"
          id="whenAdd"
          type="checkbox"
          value="whenAdd"
          onChange={onChange('whenAdd')}
          checked={triggerWay === 'whenAdd'}
        />
          新增数据时
      </label>
      {currentElement.data.triggerWay === 'whenAdd' && (
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
          onChange={onChange('whenAlter')}
          checked={triggerWay === 'whenAlter'}
        />
          修改数据时
      </label>
      {currentElement.data.triggerWay === 'whenAlter' && (
        <Select<string>
          placeholder="选择工作表中的字段"
          defaultValue={currentElement.data.whenAlterFields}
          multiple
          onChange={(v: string[]) => updateDataField('formData', 'whenAlterFields', () => v)}
          className="h-32 py-4 border border-gray-300 select-border-radius
                px-12 text-12 flex items-center flex-1 mb-8 ml-22 mt-8"
          options={formFieldOptions}
        />
      )}
    </div>
  );
});

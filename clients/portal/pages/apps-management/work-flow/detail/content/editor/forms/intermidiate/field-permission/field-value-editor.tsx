import React, { useState, useEffect, memo } from 'react';

import More from '@c/more';
import Icon from '@c/icon';
import RadioGroup from '@c/radio/group';
import Radio from '@c/radio';
import Select from '@c/select';

import usePrevious from '@lib/hooks/use-previous';

import ActionButtonGroup from '../../../components/_common/action-button-group';

interface Props {
  defaultValue?: {
    variable: string;
    static: string;
  };
  onSave: (value: {
    variable: string;
    static: string;
  }) => void;
}

function FieldValueEditor({ defaultValue = { variable: '', static: '' }, onSave }: Props) {
  const [type, setType] = useState(defaultValue.variable ? 'variable' : 'static');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const variables = [{
    label: '变量名称1 ${bmp_originator1}',
    value: '${bmp_originator1}',
  }, {
    label: '变量名2 ${bmp_originator2}',
    value: '${bmp_originator2}',
  }, {
    label: '变量名2 ${bmp_originator3}',
    value: '${bmp_originator3}',
  }, {
    label: '变量名2 ${bmp_originator4}',
    value: '${bmp_originator4}',
  }, {
    label: '变量名2 ${bmp_originator5}',
    value: '${bmp_originator5}',
  }];

  const previousType = usePrevious(type);

  useEffect(() => {
    if (previousType !== type) {
      setValue({
        variable: '',
        static: '',
      });
    }
  }, [type]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  function onCancel() {
    setValue(defaultValue);
    setIsEditorOpen(false);
  }

  function onSubmit() {
    onSave(value);
    setIsEditorOpen(false);
  }

  return (
    <More<JSX.Element>
      open={isEditorOpen}
      contentClassName="right-0 w-auto p-0"
      contentItemClassName="hover:bg-white rounded-12"
      items={[(
        <div
          className="px-16 pt-16 w-316"
          key="fieldValueEditor"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="mb-12 text-body2">设置字段初始值</p>
          <div className="flex items-center mb-8">
            <RadioGroup onChange={(value) => setType(value as string)}>
              <Radio
                defaultChecked={type === 'variable'}
                value="variable"
                label="使用工作流变量"
                className="mr-16"
              />
              <Radio
                defaultChecked={type === 'static'}
                value="static"
                label="使用固定值"
              />
            </RadioGroup>
          </div>
          {
            type === 'variable' && (
              <Select<string>
                options={variables}
                defaultValue={value.variable}
                onChange={(value: string) => setValue((v) => ({ ...v, variable: value }))}
                placeholder="选择工作流中的变量"
                className="h-32 py-4 border border-gray-300 input-border-radius
                  px-12 text-12 flex items-center flex-1 mb-8 mt-8"
              />
            )
          }
          {
            type === 'static' && (
              <input
                className="input transition-none"
                type="text"
                autoFocus
                defaultValue={value.static}
                onChange={(e) => setValue((v) => ({ ...v, static: e.target.value }))}
              />
            )
          }
          <ActionButtonGroup className="mt-16" onCancel={onCancel} onSubmit={onSubmit} />
        </div>
      )]}
    >
      <div onClick={() => setIsEditorOpen(true)}>
        {(defaultValue.static || defaultValue.variable) && (
          <span className="cursor-pointer">{defaultValue.static || defaultValue.variable}</span>
        )}
        {(!defaultValue.static && !defaultValue.variable) && (
          <Icon
            name="edit"
            className="ml-4 cursor-pointer"
          />
        )}
      </div>
    </More>
  );
}

export default memo(FieldValueEditor) as typeof FieldValueEditor;

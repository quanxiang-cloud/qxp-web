import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';
import { useCss } from 'react-use';
import cs from 'classnames';

import Icon from '@c/icon';
import RadioGroup from '@c/radio/group';
import Radio from '@c/radio';
import Select from '@c/select';
import usePrevious from '@lib/hooks/use-previous';
import ActionButtonGroup from '@flowEditor/components/_common/action-button-group';
import type { FieldValue } from '@flowEditor/type';
import FormRenderer from '@c/form-builder/form-renderer';

interface Props {
  defaultValue?: FieldValue;
  onSave: (value: FieldValue) => void;
  variableOptions?: {label: string; value: string;}[];
  schema: ISchema;
}

function FieldValueEditor({
  defaultValue = { variable: '', staticValue: '' },
  variableOptions,
  onSave,
  schema,
}: Props): JSX.Element {
  const [type, setType] = useState(defaultValue.variable ? 'variable' : 'staticValue');
  const [referenceElRef, setReferenceElRef] = useState(null);
  const [popperElRef, setPopperElRef] = useState(null);
  const { attributes, styles } = usePopper(referenceElRef, popperElRef, {
    modifiers: [{ name: 'offset', options: { offset: [0, 4] } }],
    placement: 'bottom-start',
  });
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const previousType = usePrevious(type);
  useEffect(() => {
    if (previousType !== type) {
      setValue({
        variable: value.variable,
        staticValue: value.staticValue,
      });
    }
  }, [type]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  function onCancel(): void {
    setValue(defaultValue);
    setIsEditorOpen(false);
  }

  function onSubmit(): void {
    onSave(value);
    setIsEditorOpen(false);
  }

  function onFormValueChange(value: Record<string, string>): void {
    let val = Object.values(value)[0];
    if (Array.isArray(val)) {
      val = val[0];
    }
    if ((val as any).value) {
      val = (val as any).value;
    }
    setValue((v) => ({ ...v, staticValue: val }));
  }

  const valueSetterClassName = useCss({
    'input+.uploader': {
      minWidth: 'auto',
      padding: '0 42px',
    },
  });

  return (
    <>
      <div onClick={() => setIsEditorOpen(true)}>
        {(defaultValue.staticValue || defaultValue.variable) && (
          <span className="cursor-pointer" ref={setReferenceElRef as any}>
            {defaultValue.staticValue || defaultValue.variable}
          </span>
        )}
        {(!defaultValue.staticValue && !defaultValue.variable) && (
          <Icon
            name="edit"
            className="ml-4 cursor-pointer"
            ref={setReferenceElRef as any}
          />
        )}
      </div>
      {isEditorOpen && createPortal(
        <div
          {...attributes.popper}
          ref={setPopperElRef as any}
          style={styles.popper}
          className={cs(
            'px-16 pt-16 w-316 z-10 bg-white border border-gray-300 rounded-8',
            valueSetterClassName,
          )}
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
                defaultChecked={type === 'staticValue'}
                value="staticValue"
                label="使用固定值"
              />
            </RadioGroup>
          </div>
          {
            type === 'variable' && (
              <>
                <Select<string>
                  options={variableOptions || []}
                  defaultValue={value.variable}
                  onChange={(value: string) => setValue((v) => ({ ...v, variable: value }))}
                  placeholder="选择工作流中的变量"
                  className="h-32 py-4 border border-gray-300 corner-2-8-8-8
                  px-12 text-12 flex items-center flex-1 mb-8 mt-8"
                />
                <ActionButtonGroup className="mt-16" onCancel={onCancel} onSubmit={onSubmit} />
              </>
            )
          }
          {
            type === 'staticValue' && schema && (
              <>
                <FormRenderer
                  schema={schema}
                  defaultValue={{ [Object.keys(schema.properties || {})[0]]: value.staticValue }}
                  onFormValueChange={onFormValueChange}
                >
                  <ActionButtonGroup className="mt-16" onCancel={onCancel} onSubmit={onSubmit} />
                </FormRenderer>
              </>
            )
          }
        </div>,
        document.body,
      )}
    </>
  );
}

export default FieldValueEditor;

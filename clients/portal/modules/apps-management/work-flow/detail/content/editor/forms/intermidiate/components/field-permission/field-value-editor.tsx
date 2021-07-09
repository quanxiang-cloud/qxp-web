import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';
import { useCss } from 'react-use';
import cs from 'classnames';
import { isArray, isObject } from 'lodash';

import Icon from '@c/icon';
import RadioGroup from '@c/radio/group';
import Radio from '@c/radio';
import Select from '@c/select';
import ActionButtonGroup from '@flowEditor/components/_common/action-button-group';
import type { FieldValue } from '@flowEditor/type';
import FormRenderer from '@c/form-builder/form-renderer';

function parseDisplayValue(value: any): any {
  let displayValue = value;
  if (isArray(displayValue)) {
    if (!displayValue.some(isArray) && !displayValue.some(isObject)) {
      displayValue = displayValue.join(',');
    } else {
      displayValue = displayValue.map(parseDisplayValue);
    }
  } else if (displayValue?.label) {
    displayValue = displayValue.label;
  } else if (isObject(displayValue) && displayValue.toString() !== '[object Object]') {
    displayValue = displayValue.toString();
  } else if (displayValue?.value) {
    displayValue = displayValue.value;
  } else if (displayValue !== '') {
    displayValue = JSON.stringify(displayValue);
  }
  return displayValue;
}

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

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  function onCancel(): void {
    setValue(defaultValue);
    setIsEditorOpen(false);
  }

  function onSubmit(): void {
    onSave({
      variable: type === 'variable' ? value.variable : '',
      staticValue: type === 'staticValue' ? value.staticValue : '',
    });
    setIsEditorOpen(false);
  }

  function onFormValueChange(value: Record<string, any>): void {
    setValue((v) => ({ ...v, staticValue: Object.values(value)[0] }));
  }

  const valueSetterClassName = useCss({
    'input+.uploader': {
      minWidth: 'auto',
      padding: '0 42px',
    },
  });

  let { staticValue, variable } = defaultValue;
  const staticValueOptions = Object.values(schema?.properties || {})[0]?.enum as {
    label: string;
    value: string;
  }[];
  if (isArray(staticValue) && staticValueOptions?.length) {
    staticValue = staticValue.map((v) => {
      return staticValueOptions.find((option) => option?.value === v)?.label || v;
    });
  }
  variable = variableOptions?.find(({ value }) => value === variable)?.label || variable;
  let displayValue = staticValue || variable;
  displayValue = parseDisplayValue(displayValue);

  return (
    <>
      <div onClick={() => setIsEditorOpen(true)}>
        {displayValue && (
          <span className="cursor-pointer" ref={setReferenceElRef as any}>
            {displayValue}
          </span>
        )}
        {!displayValue && (
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

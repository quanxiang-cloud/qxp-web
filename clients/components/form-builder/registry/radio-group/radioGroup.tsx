import React from 'react';
import { Radio, Input, RadioChangeEvent, Space } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import useEnumOptions from '@lib/hooks/use-enum-options';
import FormDataValueRenderer from '@c/form-data-value-renderer';

import {
  CUSTOM_OTHER_VALUE,
  usePairValue,
  useCustomOtherValue,
} from '@c/form-builder/utils/label-value-pairs';

function RadioGroup(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const options = useEnumOptions(fieldProps);
  const [otherValue, setOtherValue] = useCustomOtherValue(fieldProps.value);
  const realValue = usePairValue(fieldProps.value);
  const isAllowCustom = !!fieldProps.props['x-component-props'].allowCustom;
  const optionsLayout = fieldProps.props['x-component-props'].optionsLayout;

  function handleRadioChange(e: RadioChangeEvent): void {
    const selectedOption = options.find(({ value }) => value === e.target.value);
    if (selectedOption) {
      fieldProps.mutators.change(`${selectedOption.label}:${selectedOption.value}`);
      return;
    }

    fieldProps.mutators.change(`${otherValue}:${CUSTOM_OTHER_VALUE}`);
  }

  function handleOtherValueChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setOtherValue(e.target.value);
    if (realValue === CUSTOM_OTHER_VALUE) {
      fieldProps.mutators.change(`${e.target.value}:${CUSTOM_OTHER_VALUE}`);
    }
  }

  if (options.length === 0) {
    return <span>暂无可选项</span>;
  }

  if (fieldProps.props.readOnly) {
    return <FormDataValueRenderer schema={fieldProps.schema} value={fieldProps.value} />;
  }

  return (
    <div className="flex items-center">
      <Radio.Group onChange={handleRadioChange} value={realValue}>
        <Space direction={optionsLayout}>
          {
            options.map((option) => {
              return (<Radio key={option.value} value={option.value}>{option.label}</Radio>);
            })
          }
          {
            isAllowCustom && (
              <Radio value={CUSTOM_OTHER_VALUE}>
                <Input value={otherValue} onChange={handleOtherValueChange} placeholder="请输入" />
              </Radio>
            )
          }
        </Space>
      </Radio.Group>
    </div>
  );
}

RadioGroup.isFieldComponent = true;

export default RadioGroup;

import React, { SetStateAction, useEffect, useMemo, useState } from 'react';
import { Radio, Input, RadioChangeEvent, Space } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import useEnumOptions from '@lib/hooks/use-enum-options';
import FormDataValueRenderer from '@c/form-data-value-renderer';

const CUSTOM_OTHER_VALUE = 'CUSTOM_OTHER_VALUE';

function useCustomOtherValue(
  labels: string[],
  initialValue: string,
): [string, React.Dispatch<SetStateAction<string>>] {
  const [customValue, setCustomValue] = useState(initialValue);
  useEffect(() => {
    if (labels.includes(initialValue)) {
      setCustomValue('');
    }
  }, [labels]);

  return [customValue, setCustomValue];
}

function RadioGroup(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const labels = useEnumOptions(fieldProps);
  const [otherValue, setOtherValue] = useCustomOtherValue(labels, fieldProps.value);
  const isAllowCustom = !!fieldProps.props['x-component-props'].allowCustom;
  const realValue = useMemo(() => {
    if (!isAllowCustom) {
      return fieldProps.value;
    }

    return labels.find((label) => label === fieldProps.value) || CUSTOM_OTHER_VALUE;
  }, [fieldProps.value, labels]);

  const optionsLayout = fieldProps.props['x-component-props'].optionsLayout;
  function handleRadioChange(e: RadioChangeEvent): void {
    const selectedOption = labels.find((label) => label === e.target.value);
    if (selectedOption) {
      fieldProps.mutators.change(selectedOption);
      return;
    }

    fieldProps.mutators.change(otherValue);
  }

  function handleOtherValueChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setOtherValue(e.target.value);
    if (realValue === CUSTOM_OTHER_VALUE) {
      fieldProps.mutators.change(e.target.value);
    }
  }

  if (labels.length === 0) {
    return <span>暂无可选项</span>;
  }

  if (fieldProps.props.readOnly) {
    return <FormDataValueRenderer schema={fieldProps.schema} value={fieldProps.value} />;
  }

  return (
    <div className="flex items-center">
      <Radio.Group onChange={handleRadioChange} value={realValue}>
        <Space direction={optionsLayout}>
          {labels.map((label) => {
            return (<Radio key={label} value={label}>{label}</Radio>);
          })}
          {isAllowCustom && (
            <Radio value={CUSTOM_OTHER_VALUE}>
              <Input
                value={otherValue}
                onChange={handleOtherValueChange}
                placeholder="请输入"
                maxLength={15}
              />
            </Radio>
          )}
        </Space>
      </Radio.Group>
    </div>
  );
}

RadioGroup.isFieldComponent = true;

export default RadioGroup;

import React, { SetStateAction, useEffect, useMemo, useState } from 'react';
import { Checkbox, Input, Space } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

import useEnumOptions from '@lib/hooks/use-enum-options';
import FormDataValueRenderer from '@c/form-data-value-renderer';
import { uniq } from 'lodash';

const CUSTOM_OTHER_VALUE = 'CUSTOM_OTHER_VALUE';

function useCustomOtherValue(
  options: string[],
  initialValues: string[],
): [string, React.Dispatch<SetStateAction<string>>] {
  const [customValue, setCustomValue] = useState('');
  useEffect(() => {
    const initCustomValue = initialValues?.find((value) => !options.includes(value));
    if (initCustomValue) {
      setCustomValue(initCustomValue);
    }
  }, [options]);

  return [customValue, setCustomValue];
}

function CheckBoxGroup(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const options = useEnumOptions(fieldProps);
  const [otherValue, setOtherValue] = useCustomOtherValue(options, fieldProps.value);
  const { optionsLayout } = fieldProps.props['x-component-props'];
  const isAllowCustom = !!fieldProps.props['x-component-props'].allowCustom;

  const realValue = useMemo(() => {
    if (!isAllowCustom) {
      return fieldProps.value;
    }

    const realValueTmp = fieldProps.value.filter((value:string) => options.includes(value));
    return realValueTmp.length !== fieldProps.value.length ?
      [...realValueTmp, CUSTOM_OTHER_VALUE] :
      realValueTmp;
  }, [fieldProps.value, options]);

  function handleCheckBoxChange(value: Array<CheckboxValueType>): void {
    if (value.includes(CUSTOM_OTHER_VALUE)) {
      fieldProps.mutators.change(uniq([
        ...value.filter((label) => options.includes((label as string))),
        otherValue,
      ]));
      return;
    }
    fieldProps.mutators.change(value as string[]);
  }

  function handleOtherValueChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setOtherValue(e.target.value);
    if (realValue.includes(CUSTOM_OTHER_VALUE)) {
      fieldProps.mutators.change(uniq([
        ...fieldProps.value.filter((value: string) => options.includes(value)),
        e.target.value,
      ]));
    }
  }

  if (!options.length) {
    return <span>暂无可选项</span>;
  }

  if (fieldProps.props.readOnly) {
    return <FormDataValueRenderer value={fieldProps.value} schema={fieldProps.schema} />;
  }

  return (
    <div className="flex items-center">
      <Checkbox.Group onChange={handleCheckBoxChange} value={realValue}>
        <Space direction={optionsLayout}>
          {options.map((option): JSX.Element => (
            <Checkbox key={option} value={option}>{option}</Checkbox>
          ))}
        </Space>
        {isAllowCustom && (
          <Checkbox value={CUSTOM_OTHER_VALUE}>
            <Input
              value={otherValue}
              onChange={handleOtherValueChange}
              placeholder="请输入"
              maxLength={15}
            />
          </Checkbox>
        )}
      </Checkbox.Group>
    </div>
  );
}

CheckBoxGroup.isFieldComponent = true;

export default CheckBoxGroup;

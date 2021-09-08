import React from 'react';
import { Checkbox, Space } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

import useEnumOptions from '@lib/hooks/use-enum-options';
import FormDataValueRenderer from '@c/form-data-value-renderer';
import {
  usePairListValue,
  toLabelValuePairList,
} from '@c/form-builder/utils/label-value-pairs';

function CheckBoxGroup(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const options = useEnumOptions(fieldProps);
  const checkboxValue = usePairListValue(fieldProps.value);
  const { optionsLayout } = fieldProps.props['x-component-props'];

  function handleCheckBoxChange(value: Array<CheckboxValueType>): void {
    const values = toLabelValuePairList(value as string[], options);
    fieldProps.mutators.change(values);
  }

  if (!options.length) {
    return <span>暂无可选项</span>;
  }

  if (fieldProps.props.readOnly) {
    return <FormDataValueRenderer value={fieldProps.value} schema={fieldProps.schema} />;
  }

  return (
    <div className="flex items-center">
      <Checkbox.Group onChange={handleCheckBoxChange} value={checkboxValue}>
        <Space direction={optionsLayout}>
          {
            options.map((option): JSX.Element => {
              return (
                <Checkbox key={option.value} value={option.value}>{option.label}</Checkbox>);
            })
          }
        </Space>
      </Checkbox.Group>
    </div>
  );
}

CheckBoxGroup.isFieldComponent = true;

export default CheckBoxGroup;

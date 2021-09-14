import React from 'react';
import { Select } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import useEnumOptions from '@lib/hooks/use-enum-options';
import FormDataValueRenderer from '@c/form-data-value-renderer';

const { Option } = Select;

function MultipleSelect(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const options = useEnumOptions(fieldProps);

  if (fieldProps.props.readOnly) {
    return <FormDataValueRenderer value={fieldProps.value} schema={fieldProps.schema} />;
  }

  return (
    <Select
      mode="multiple"
      value={fieldProps.value}
      onChange={fieldProps.mutators.change}
    >
      {options.map((option): JSX.Element => (
        <Option key={option} value={option}>{option}</Option>
      ))}
    </Select>
  );
}

MultipleSelect.isFieldComponent = true;

export default MultipleSelect;

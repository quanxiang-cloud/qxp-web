import React from 'react';
import { Select } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import useEnumOptions from '@lib/hooks/use-enum-options';
import { toLabelValuePairList } from '@lib/utils';
import { usePairListValue, usePairListLabel } from '@c/form-builder/utils/label-value-pairs';

const { Option } = Select;

function MultipleSelect(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const options = useEnumOptions(fieldProps);
  const selectValue = usePairListValue(fieldProps.value);
  const readableValue = usePairListLabel(fieldProps.props.enum || [], fieldProps.value);

  function handleSelectChange(value: string[]): void {
    const values = toLabelValuePairList(value, options);
    fieldProps.mutators.change(values);
  }

  if (fieldProps.props.readOnly) {
    return <>{readableValue.join(', ') || '-'}</>;
  }

  return (
    <Select
      mode="multiple"
      value={selectValue}
      onChange={handleSelectChange}
    >
      {
        options.map((option): JSX.Element => {
          return (
            <Option key={option.value} value={option.value}>{option.label}</Option>);
        })
      }
    </Select>
  );
}

MultipleSelect.isFieldComponent = true;

export default MultipleSelect;

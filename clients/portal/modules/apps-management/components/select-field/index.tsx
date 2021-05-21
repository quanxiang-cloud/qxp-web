import React from 'react';
import { Control, Form } from '@QCFE/lego-ui';

import Select from '@c/select';

type Props = Form.SelectFieldProps & { placeholder: string | undefined }

function SelectField({
  options,
  onChange,
  placeholder,
  value,
}: Props, ref?: React.LegacyRef<Control>) {
  return (
    <Control ref={ref}>
      <Select
        placeholder={placeholder}
        options={options}
        onChange={onChange}
        defaultValue={value}
      />
    </Control>
  );
}

export default Form.getFormField(React.forwardRef(SelectField));

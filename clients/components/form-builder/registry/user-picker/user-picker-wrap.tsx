import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import FormDataValueRenderer from '@c/form-data-value-renderer';

import UserPicker from './user-picker';

const UserPickerWrap = (formField: ISchemaFieldComponentProps): JSX.Element => {
  const { optionalRange, defaultValues, defaultRange } = formField.props;

  if (formField.props.readOnly) {
    return <FormDataValueRenderer schema={formField.schema} value={formField.value} />;
  }

  return (
    <UserPicker
      {...formField.props['x-component-props']}
      onChange={formField.mutators.change}
      options={formField.props.enum}
      value={formField.value}
      editable={formField.editable ?? !formField.readOnly}
      optionalRange={optionalRange}
      defaultRange={defaultRange}
      defaultValues={defaultValues}
    />
  );
};

UserPickerWrap.isFieldComponent = true;

export default UserPickerWrap;

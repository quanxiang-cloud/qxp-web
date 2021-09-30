import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import UserPicker from './user-picker';

const UserPickerWrap = (formField: ISchemaFieldComponentProps): JSX.Element => {
  const { optionalRange, defaultValues, defaultRange } = formField.props;

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

import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import UserPicker from './user-picker';

const UserPickerWrap = (formField: ISchemaFieldComponentProps): JSX.Element => {
  const { optionalRange, defaultRange, defaultValues, multiple } = formField.props;

  React.useEffect(() => {
    if (defaultRange === 'currentUser') {
      const userinfo = window.USER;
      const options = [{
        label: userinfo.userName,
        value: userinfo.id,
      }];

      formField.mutators.change(options);
      return;
    }

    formField.mutators.change(formField.initialValue || defaultValues);
  }, [optionalRange, multiple, defaultRange]);

  const xComponentsProps = Object.assign({}, formField.props['x-component-props'], {
    onChange: formField.mutators.change,
    options: formField.props.enum,
    value: formField.value,
    editable: formField.editable ?? !formField.readOnly,
  });

  return (
    <UserPicker
      {...xComponentsProps}
      optionalRange={optionalRange}
      defaultRange={defaultRange}
    />
  );
};

UserPickerWrap.isFieldComponent = true;

export default UserPickerWrap;

import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { isUndefined } from 'lodash';

import UserPicker from './user-picker';

const UserPickerWrap = (formField: ISchemaFieldComponentProps): JSX.Element => {
  const { optionalRange, defaultRange, defaultValues, multiple } = formField.props;
  const isEditable = !!(isUndefined(formField?.editable) ? formField?.props.editable : formField?.editable);

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
    editable: isEditable,
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

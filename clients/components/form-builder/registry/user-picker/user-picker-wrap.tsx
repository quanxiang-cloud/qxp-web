import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import UserPicker from './user-picker';

type OptionalRange = 'customize' | 'all' | 'currentUser';

const UserPickerWrap = (formField: ISchemaFieldComponentProps): JSX.Element => {
  const optionalRange = formField.props.optionalRange as OptionalRange;
  React.useEffect(() => {
    if (optionalRange === 'currentUser') {
      const userInfo = window.USER;
      const options = [{
        label: userInfo.userName,
        value: userInfo.id,
      }];
      formField.mutators.change(options);
      formField.form.setFieldState(formField.name, (state) => {
        state.props.enum = options;
      });
      return;
    }

    formField.mutators.change(handleInitValue(formField));
  }, [optionalRange, formField.props['x-component-props'].mode]);

  const xComponentsProps = Object.assign({}, formField.props['x-component-props'], {
    onChange: formField.mutators.change,
    options: formField.props.enum,
    value: formField.value,
  });

  function handleInitValue(formField: ISchemaFieldComponentProps): LabelValue[] {
    let initialValue: LabelValue[] = [];
    if (formField.initialValue && formField.initialValue.length) {
      initialValue = formField.initialValue;
      return initialValue;
    }

    if (formField.props.defaultValues && formField.props.defaultValues.length) {
      initialValue = formField.props.defaultValues;
      return initialValue;
    }

    return initialValue;
  }

  return <UserPicker optionalRange={optionalRange} {...xComponentsProps} />;
};

UserPickerWrap.isFieldComponent = true;

export default UserPickerWrap;

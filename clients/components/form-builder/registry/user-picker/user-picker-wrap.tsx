import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import UserPicker from './user-picker';

type OptionalRange = 'customize' | 'all' | 'currentUser';

const UserPickerWrap = (p: ISchemaFieldComponentProps): JSX.Element => {
  const optionalRange = p.props.optionalRange as OptionalRange;
  React.useEffect(() => {
    if (optionalRange === 'currentUser') {
      const userInfo = window.USER;
      const { id, userName } = userInfo;
      const options = [{
        label: userName,
        value: id,
      }];
      p.mutators.change(options);
      p.form.setFieldState(p.name, (state) => {
        state.props.enum = options;
      });
      return;
    }

    p.mutators.change(
      (p.initialValue.length && p.initialValue) ||
      (p.props.defaultValues.length && p.props.defaultValues) ||
      [],
    );
  }, [optionalRange, p.props['x-component-props'].mode]);

  const xComponentsProps = Object.assign({}, p.props['x-component-props'], {
    onChange: p.mutators.change,
    options: p.props.enum,
    value: p.value,
  });

  return <UserPicker optionalRange={optionalRange} {...xComponentsProps} />;
};

UserPickerWrap.isFieldComponent = true;

export default UserPickerWrap;

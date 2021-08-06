import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { useUpdateEffect } from 'react-use';

import UserPicker from './user-picker';

type OptionalRange = 'customize' | 'all'

const UserPickerWrap = (p: ISchemaFieldComponentProps): JSX.Element => {
  const optionalRange = p.props.optionalRange as OptionalRange;
  useUpdateEffect(() => {
    p.mutators.change(p.props.defaultValues || []);
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

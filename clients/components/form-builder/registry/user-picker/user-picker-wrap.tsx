/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React from 'react';
import { isArray, noop } from 'lodash';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import UserPicker from './user-picker';

const UserPickerWrap = (formField: ISchemaFieldComponentProps): JSX.Element => {
  const { optionalRange, defaultValues, defaultRange } = formField.props;
  const getDefaultValues = ()=>{
    let _defaultValues = defaultValues;
    if (isArray(_defaultValues) && !_defaultValues.length) {
      _defaultValues = undefined;
    }
    return _defaultValues;
  };
  return (
    <UserPicker
      {...formField.props['x-component-props']}
      // onChange={formField?.mutators?.change ? formField?.mutators?.change : noop}
      onChange={formField?.isSubTableComponent ? (formField?.onChange ? formField?.onChange : noop) : (formField?.mutators?.change ? formField?.mutators?.change : noop)}
      options={formField.props.enum}
      value={formField.value}
      editable={formField.editable ?? !formField.readOnly}
      optionalRange={optionalRange}
      defaultRange={defaultRange}
      defaultValues={getDefaultValues()}
    />
  );
};

UserPickerWrap.isFieldComponent = true;

export default UserPickerWrap;

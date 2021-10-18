import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { noop } from 'lodash';

import OrganizationPicker from './organization-select';

const OrganizationPickerWrap = (formField: ISchemaFieldComponentProps): JSX.Element => {
  const { optionalRange, rangeList, multiple, defaultRange, defaultValues } = formField.props;

  return (
    <OrganizationPicker
      {...formField.props['x-component-props']}
      multiple={multiple}
      rangeList={rangeList}
      editable={formField.editable ?? !formField.readOnly}
      optionalRange={optionalRange}
      defaultValues={defaultValues}
      defaultRange={defaultRange}
      value={formField.value}
      onChange={formField?.mutators?.change ? formField?.mutators?.change : noop}
    />
  );
};

OrganizationPickerWrap.isFieldComponent = true;

export default OrganizationPickerWrap;

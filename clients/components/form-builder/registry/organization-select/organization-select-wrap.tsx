import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { labelValueRenderer } from '@c/form-data-value-renderer';

import OrganizationPicker from './organization-select';

const OrganizationPickerWrap = (formField: ISchemaFieldComponentProps): JSX.Element => {
  const { optionalRange, rangeList, multiple, defaultRange, defaultValues } = formField.props;

  if (formField.props.readOnly) {
    return <span>{labelValueRenderer(formField.value)}</span>;
  }

  return (
    <OrganizationPicker
      {...formField.props['x-component-props']}
      multiple={multiple}
      rangeList={rangeList}
      optionalRange={optionalRange}
      defaultValues={defaultValues}
      defaultRange={defaultRange}
      value={formField.value}
      onChange={formField.mutators.change}
    />
  );
};

OrganizationPickerWrap.isFieldComponent = true;

export default OrganizationPickerWrap;

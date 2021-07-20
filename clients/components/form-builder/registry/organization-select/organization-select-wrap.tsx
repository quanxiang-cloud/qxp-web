import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import OrganizationPicker from './organization-select';

const OrganizationPickerWrap = (p: ISchemaFieldComponentProps): JSX.Element => {
  const { optionalRange, rangeList, multiple } = p.props;
  React.useEffect(() => {
    p.mutators.change(p.initialValue || p.props.defaultValues);
  }, [optionalRange, multiple]);

  return (
    <OrganizationPicker
      {...p.props['x-component-props']}
      multiple={multiple}
      rangeList={rangeList}
      optionalRange={optionalRange}
      value={p.value}
      onChange={p.mutators.change}
    />
  );
};

OrganizationPickerWrap.isFieldComponent = true;

export default OrganizationPickerWrap;

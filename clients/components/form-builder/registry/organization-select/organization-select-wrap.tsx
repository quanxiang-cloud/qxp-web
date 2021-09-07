import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { getUserDepartment } from '@lib/utils';

import OrganizationPicker from './organization-select';

const OrganizationPickerWrap = (formField: ISchemaFieldComponentProps): JSX.Element => {
  const { optionalRange, rangeList, multiple, defaultRange, defaultValues } = formField.props;

  React.useEffect(() => {
    if (defaultRange === 'myDep') {
      const userinfo = window.USER;
      const { id, departmentName } = getUserDepartment(userinfo);
      formField.mutators.change([{ label: departmentName, value: id }]);
      return;
    }

    formField.mutators.change(formField.initialValue || defaultValues);
  }, [optionalRange, multiple, defaultRange]);

  return (
    <OrganizationPicker
      {...formField.props['x-component-props']}
      multiple={multiple}
      rangeList={rangeList}
      optionalRange={optionalRange}
      defaultRange={defaultRange}
      disabled={!(formField.editable ?? !formField.readOnly)}
      value={formField.value}
      onChange={formField.mutators.change}
    />
  );
};

OrganizationPickerWrap.isFieldComponent = true;

export default OrganizationPickerWrap;

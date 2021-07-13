import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { TreeNode } from 'react-dropdown-tree-select';
import OrganizationPicker from './organization-select';

const OrganizationPickerWrap = (p: ISchemaFieldComponentProps): JSX.Element => {
  React.useEffect(() => {
    p.mutators.change(p.initialValue || p.props.defaultValues);
  }, []);

  const { optionalRange, rangeList, multiple, placeholder } = p.props;

  return (
    <OrganizationPicker
      appID={p.props.appID}
      multiple={multiple}
      placeholder={placeholder}
      rangeList={rangeList}
      optionalRange={optionalRange}
      value={(p.value || []).map((itm: TreeNode) => itm.value)}
      onChange={(selects) => p.mutators.change(selects)}
    />
  );
};

OrganizationPickerWrap.isFieldComponent = true;

export default OrganizationPickerWrap;

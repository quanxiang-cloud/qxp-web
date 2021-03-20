import React from 'react';

import Select from '@c/select';
import { useQuery } from 'react-query';

import {
  departmentToTreeNode,
} from '@portal/pages/access-control/company-maillist/departments-tree/store';
import { flatTree } from '../headless-tree/utils';
import { getERPTree } from '@portal/pages/access-control/company-maillist/api';


type DepartmentPickerProps = {
  initialDepartmentID?: string;
  onChange: (department: Department) => void;
}

function DepartmentPicker({ initialDepartmentID, onChange }: DepartmentPickerProps): JSX.Element {
  const { data, isLoading, isError } = useQuery('getERPTree', getERPTree);

  if (isLoading || isError) {
    return (<span>loading</span>);
  }

  const departments = flatTree(departmentToTreeNode(data as any));

  const options = departments.map(({ name, id }) => {
    return { value: id, label: name };
  });

  return (
    <Select
      className="max-w-full w-full"
      options={options}
      onChange={(depID: string) => {
        const selectedDep = departments.find(({ id }) => id === depID);
        if (!selectedDep) {
          return;
        }

        onChange(selectedDep.data);
      }}
    />
  );
}

export default DepartmentPicker;

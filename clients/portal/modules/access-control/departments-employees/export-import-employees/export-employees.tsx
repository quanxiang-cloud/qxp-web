import React, { useState } from 'react';

import Radio, { RadioValueType } from '@c/radio';
import RadioGroup from '@c/radio/group';
// import EmployeeOrDepartmentPickerModal from '@c/employee-or-department-picker';
import EmployeeOrDepartmentPicker from '@c/employee-or-department-picker/picker';

type PickState = {
  deptList: EmployeeOrDepartmentOfRole[];
  employees: EmployeeOrDepartmentOfRole[];
  groups: EmployeeOrDepartmentOfRole[];
};

export default function ExportEmployees(): JSX.Element {
  const [exportScop, setExportScop] = useState<RadioValueType>('export-all');
  // const [showPicker, setShowPicker] = useState(false);
  const [pickState, setPickState] = useState<PickState>({ deptList: [], employees: [], groups: [] });
  const [pickList, setPickList] = useState<EmployeeOrDepartmentOfRole[]>([]);

  function handleChange(value: RadioValueType): void {
    setExportScop(value);
    if (value === 'export-part') {
      // setShowPicker(true);
      classifyPick(pickList);
    }
  }

  // async function handleSubmit(
  //   deptList: EmployeeOrDepartmentOfRole[],
  //   employees: EmployeeOrDepartmentOfRole[],
  //   groups: EmployeeOrDepartmentOfRole[],
  // ): Promise<void> {
  //   setPickState({ deptList, employees, groups });
  //   setShowPicker(false);
  // }

  function classifyPick(pickList: EmployeeOrDepartmentOfRole[]): void {
    const deptList: EmployeeOrDepartmentOfRole[] = [];
    const employees: EmployeeOrDepartmentOfRole[] = [];
    const groups: EmployeeOrDepartmentOfRole[] = [];

    pickList.forEach((pickItem) => {
      if (pickItem.type === 1) {
        employees.push(pickItem);
      } else if (pickItem.type === 2) {
        deptList.push(pickItem);
      } else {
        groups.push(pickItem);
      }
    });

    setPickState({ deptList, employees, groups });
  }

  return (
    <div>
      <div className="flex">
        <RadioGroup onChange={handleChange} value={exportScop}>
          <Radio value='export-all' label="导出全部"/>
          <Radio className="ml-10" value='export-part' label="导出部分"/>
        </RadioGroup>
      </div>
      {/* {showPicker &&
        (<EmployeeOrDepartmentPickerModal
          pickGroups
          title="导出部分员工"
          submitText="确定"
          onSubmit={handleSubmit}
          employees={pickState.employees}
          departments={pickState.deptList}
          groups={pickState.groups}
          onCancel={() => setShowPicker(false)}
        />)
      } */}
      {exportScop === 'export-part' &&
      (<EmployeeOrDepartmentPicker
        pickGroups
        employees={pickState.employees}
        departments={pickState.deptList}
        groups={pickState.groups}
        onChange={setPickList}
      />)}
    </div>
  );
}

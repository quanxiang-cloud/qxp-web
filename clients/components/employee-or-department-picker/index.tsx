import React, { useState } from 'react';

import Modal from '@c/modal';
import toast from '@lib/toast';

import EmployeeOrDepartmentPicker from './picker';

interface Props {
  title: string;
  submitText: string;
  onSubmit: (
    departments: EmployeeOrDepartmentOfRole[],
    employees: EmployeeOrDepartmentOfRole[],
    groups: EmployeeOrDepartmentOfRole[]
  ) => Promise<boolean | void>;
  onCancel: () => void;
  employees?: EmployeeOrDepartmentOfRole[];
  departments?: EmployeeOrDepartmentOfRole[];
  groups?: EmployeeOrDepartmentOfRole[];
  excludeDepartments?: boolean;
  pickGroups?: boolean;
}

export default function EmployeeOrDepartmentPickerModal({
  departments,
  employees,
  groups,
  onSubmit,
  onCancel,
  title,
  submitText,
  excludeDepartments,
  pickGroups,
}: Props): JSX.Element {
  const [departmentsOrEmployees, setDepartmentsOrEmployees] = useState<
    EmployeeOrDepartmentOfRole[]
  >([]);
  const [isOnGetSelected, setIsOnGetSelected] = useState(false);

  function onGetSelected(): void {
    const employees: EmployeeOrDepartmentOfRole[] = [];
    const departments: EmployeeOrDepartmentOfRole[] = [];
    const groups: EmployeeOrDepartmentOfRole[] = [];
    departmentsOrEmployees.forEach((departmentOrEmployees) => {
      if (departmentOrEmployees.type === 1) {
        employees.push(departmentOrEmployees);
      } else if (departmentOrEmployees.type === 2) {
        departments.push(departmentOrEmployees);
      } else if (departmentOrEmployees.type === 3) {
        groups.push(departmentOrEmployees);
      }
    });
    if (employees.length === 0 && departments.length === 0 && groups.length === 0) {
      toast.error('请选择人员、部门或分组');
      return;
    }
    setIsOnGetSelected(true);
    onSubmit(departments, employees, groups).then((isOk) => {
      if (isOk) {
        onCancel();
      } else {
        setIsOnGetSelected(false);
      }
    }).catch((err) => {
      setIsOnGetSelected(false);
      toast.error(err.message);
    });
  }

  return (
    <Modal
      title={title}
      onClose={onCancel}
      width={1234}
      height={760}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: onCancel,
        },
        {
          text: submitText,
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          loading: isOnGetSelected,
          onClick: onGetSelected,
        },
      ]}
    >
      <EmployeeOrDepartmentPicker
        departments={departments}
        employees={employees}
        groups={groups}
        onChange={setDepartmentsOrEmployees}
        excludeDepartments={excludeDepartments}
        pickGroups={pickGroups}
      />
    </Modal>
  );
}

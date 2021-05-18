import React, { useState } from 'react';

import Modal from '@c/modal';
import toast from '@lib/toast';

import EmployeeOrDepartmentPicker from './picker';

interface Props {
  title: string;
  submitText: string;
  onSubmit: (
    departments: EmployeeOrDepartmentOfRole[],
    employees: EmployeeOrDepartmentOfRole[]
  ) => Promise<boolean | void>;
  onCancel: () => void;
  employees?: EmployeeOrDepartmentOfRole[];
  departments?: EmployeeOrDepartmentOfRole[];
}

export default function EmployeeOrDepartmentPickerModal({
  departments,
  employees,
  onSubmit,
  onCancel,
  title,
  submitText,
}: Props) {
  const [departmentsOrEmployees, setDepartmentsOrEmployees] = useState<
    EmployeeOrDepartmentOfRole[]
  >([]);
  const [isOnGetSelected, setIsOnGetSelected] = useState(false);

  function onGetSelected() {
    const employees: EmployeeOrDepartmentOfRole[] = [];
    const departments: EmployeeOrDepartmentOfRole[] = [];
    departmentsOrEmployees.forEach((departmentOrEmployees) => {
      if (departmentOrEmployees.type === 1) {
        employees.push(departmentOrEmployees);
      } else if (departmentOrEmployees.type === 2) {
        departments.push(departmentOrEmployees);
      }
    });
    if (employees.length === 0 && departments.length === 0) {
      toast.error('请选择人员或部门');
      return;
    }
    setIsOnGetSelected(true);
    onSubmit(departments, employees).then((isOk) => {
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
        onChange={setDepartmentsOrEmployees}
      />
    </Modal>
  );
}

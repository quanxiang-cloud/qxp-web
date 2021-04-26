import React, { useState } from 'react';
import { Modal } from '@QCFE/lego-ui';

import Button from '@c/button';
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
      visible
      title={title}
      onCancel={onCancel}
      className="owner-bind-modal"
      footer={
        (<div className="flex flex-row justify-between items-center">
          <Button
            className="mr-20"
            iconName="close"
            onClick={onCancel}
          >
            取消
          </Button>
          <Button
            modifier="primary"
            iconName="check"
            type="button"
            loading={isOnGetSelected}
            onClick={onGetSelected}
          >
            {submitText}
          </Button>
        </div>)
      }
    >
      <EmployeeOrDepartmentPicker
        departments={departments}
        employees={employees}
        onChange={setDepartmentsOrEmployees}
      />
    </Modal>
  );
}

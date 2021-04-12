import React, { useState } from 'react';
import { Modal } from '@QCFE/lego-ui';

import Button from '@c/button';
import Loading from '@c/loading';
import Error from '@c/error';

import EmployeeOrDepartmentPicker from './picker';

interface Props {
  onOk: (
    departments: EmployeeOrDepartmentOfRole[],
    employees: EmployeeOrDepartmentOfRole[]
  ) => Promise<unknown>;
  visible: boolean;
  onCancel: () => void;
  employees?: EmployeeOrDepartmentOfRole[];
  departments?: EmployeeOrDepartmentOfRole[];
  isLoading?: boolean;
  errorMessage?: string;
}

export default function EmployeeOrDepartmentPickerModal({
  departments,
  employees,
  onOk,
  visible,
  onCancel,
  isLoading,
  errorMessage,
}: Props) {
  const [departmentsOrEmployees, setDepartmentsOrEmployees] = useState<
    EmployeeOrDepartmentOfRole[]
  >([]);
  const [isBindLoading, setIsBindLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  function onBind() {
    const employees: EmployeeOrDepartmentOfRole[] = [];
    const departments: EmployeeOrDepartmentOfRole[] = [];
    departmentsOrEmployees.forEach((departmentOrEmployees) => {
      if (departmentOrEmployees.type === 1) {
        employees.push(departmentOrEmployees);
      } else if (departmentOrEmployees.type === 2) {
        departments.push(departmentOrEmployees);
      }
    });
    setIsBindLoading(true);
    onOk(departments, employees).then(() => {
      setIsBindLoading(false);
    }).catch((err) => {
      setErrMsg(err.message);
    });
  }

  return (
    <Modal
      title="角色关联员工与部门"
      onCancel={onCancel}
      className="owner-bind-modal"
      visible={visible}
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
            loading={isBindLoading}
            onClick={onBind}
          >
            确定关联
          </Button>
        </div>)
      }
    >
      {isLoading && (
        <Loading desc="加载中..." />
      )}
      {(errorMessage || errMsg) && (
        <Error desc={errorMessage || errMsg} />
      )}
      {!isLoading && !errorMessage && (
        <EmployeeOrDepartmentPicker
          departments={departments}
          employees={employees}
          onChange={setDepartmentsOrEmployees}
        />
      )}
    </Modal>
  );
}

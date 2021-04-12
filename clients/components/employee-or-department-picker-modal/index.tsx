import React, { useState } from 'react';
import { Modal } from '@QCFE/lego-ui';
import { useQuery } from 'react-query';

import Button from '@c/button';
// todo remove this
import { getRoleAssociations } from '@portal/pages/access-control/role-management/api';
import Loading from '@c/loading';
import Error from '@c/error';

import EmployeeOrDepartmentPicker from './picker';

interface Props {
  onOk: (newSets: EmployeeOrDepartmentOfRole[], oldSets: EmployeeOrDepartmentOfRole[]) => void;
  visible: boolean;
  roleID: string;
  onCancel: () => void;
}

export default function EmployeeOrDepartmentPickerModal({
  onOk,
  visible,
  roleID,
  onCancel,
}: Props) {
  const [departmentsOrEmployees, setDepartmentsOrEmployees] = useState<
    EmployeeOrDepartmentOfRole[]
  >();
  const { data, isLoading, isError } = useQuery(
    [
      'GET_ROLE_ASSOCIATIONS_ALL',
      {
        roleId: roleID,
      },
    ],
    getRoleAssociations,
    {
      refetchOnWindowFocus: false,
      cacheTime: -1,
    },
  );

  function onBind() {
    departmentsOrEmployees && onOk(departmentsOrEmployees, data?.departmentsOrEmployees || []);
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
      {isError && (
        <Error desc="something wrong" />
      )}
      {!isLoading && !isError && (
        <EmployeeOrDepartmentPicker
          departments={data?.departments}
          employees={data?.employees}
          onChange={setDepartmentsOrEmployees}
        />
      )}
    </Modal>
  );
}

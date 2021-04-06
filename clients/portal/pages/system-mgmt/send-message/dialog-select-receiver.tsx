import React, { useState } from 'react';
import { Modal } from '@QCFE/lego-ui';
import { useQuery } from 'react-query';

import Button from '@c/button';
import { getRoleAssociations } from '@lib/requests/role-management';
import Loading from '@c/loading';
import Error from '@c/error';

// todo
import EmployeeOrDepartmentPicker from '@c/employee-or-department-picker-modal/picker';

interface Props {
  onOk: (adds: EmployeeOrDepartmentOfRole[], deletes: EmployeeOrDepartmentOfRole[]) => void;
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

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }
  if (isError) {
    return <Error desc="获取数据失败" />;
  }

  const onBind=()=> {
    // if (departmentsOrEmployees) {
    //   const deletes = data?.departmentsOrEmployees.filter((member) => {
    //     return !departmentsOrEmployees.find((m) => m.ownerID === member.ownerID);
    //   });
    //   const adds = departmentsOrEmployees.filter((member) => {
    //     return !data?.departmentsOrEmployees.find((m) => m.ownerID === member.ownerID);
    //   });
    //   onOk(adds, deletes || []);
    // }
    // @ts-ignore
    onOk(departmentsOrEmployees);
  };

  return (
    <Modal
      title="选择员工或部门"
      onCancel={onCancel}
      className="owner-bind-modal"
      visible={visible}
      maskClosable={false}
      footer={
        (<div className="flex flex-row justify-between items-center">
          <Button
            className="bg-white hover:bg-gray-100 transition cursor-pointer mr-20 mb-0"
            textClassName="text-gray-600 ml-2"
            icon={<img src="/dist/images/icon_error.svg" />}
            onClick={onCancel}
          >
            取消
          </Button>
          <Button
            className="bg-gray-700 hover:bg-gray-900 transition cursor-pointer mb-0"
            textClassName="text-white ml-2"
            icon={<img src="/dist/images/icon_true.svg" />}
            onClick={onBind}
          >
            确定选择
          </Button>
        </div>)
      }
    >
      <EmployeeOrDepartmentPicker
        departments={data?.departments}
        employees={data?.employees}
        onChange={setDepartmentsOrEmployees}
      />
    </Modal>
  );
}

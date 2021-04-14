import React, { useEffect, useState } from 'react';
import { Modal } from '@QCFE/lego-ui';
import { useQuery } from 'react-query';
import { toJS } from 'mobx';

import Button from '@c/button';
import { getRoleAssociations } from '@portal/pages/access-control/role-management/api';
import Loading from '@c/loading';
import Error from '@c/error';

// todo
import EmployeeOrDepartmentPicker from '@c/employee-or-department-picker/picker';

interface Props {
  picked: EmployeeOrDepartmentOfRole[],
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
  picked,
}: Props) {
  const [departmentsOrEmployees, setDepartmentsOrEmployees] = useState<
    EmployeeOrDepartmentOfRole[]
  >(picked);

  useEffect(()=>{
    console.log(picked.map((itm)=>toJS(itm)));
    visible || setDepartmentsOrEmployees(picked);
  }, [visible, picked]);

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

  const onBind = () => {
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
  console.log(departmentsOrEmployees.map((itm)=>toJS(itm)));
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
            className="mr-20 ml-2"
            iconName="close"
            onClick={onCancel}
          >
            取消
          </Button>
          <Button
            modifier="primary"
            className="ml-2"
            iconName="check"
            onClick={onBind}
          >
            确定选择
          </Button>
        </div>)
      }
    >
      <EmployeeOrDepartmentPicker
        departments={departmentsOrEmployees.filter((itm)=>itm.type==2)}
        employees={departmentsOrEmployees.filter((itm)=>itm.type==1)}
        // departments={data?.departments}
        // employees={data?.employees}
        // departments={[]}
        // employees={[]}
        onChange={setDepartmentsOrEmployees}
      />
    </Modal>
  );
}

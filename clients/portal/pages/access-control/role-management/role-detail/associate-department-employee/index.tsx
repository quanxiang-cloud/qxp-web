import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Modal } from '@QCFE/lego-ui';

import Button from '@c/button';
import Loading from '@c/loading';
import Authorized from '@clients/common/component/authorized';
import Error from '@c/error';
import Switch from '@c/switch';
import {
  getRoleAssociations,
  updateRoleAssociations,
  IUpdateRoleAssociations,
} from '@net/role-management';

import EmployeeOrDepartmentPicker from './employee-or-department-picker';
import DepartmentOrEmployeeTable from './department-or-employee-table';

export interface Props {
  id: string | number;
  isSuper: boolean;
}

export default function AssociateDepartmentEmployee({ id, isSuper }: Props) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBindType, setShowBindType] = useState<string | number>(1);
  const [departmentsOrEmployees, setDepartmentsOrEmployees] = useState<
    EmployeeOrDepartmentOfRole[]
  >();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery(
    [
      'GET_ROLE_ASSOCIATIONS_ALL',
      {
        roleID: id,
      },
    ],
    getRoleAssociations,
    {
      refetchOnWindowFocus: false,
      cacheTime: -1,
    },
  );

  const mutation = useMutation(
    (arg: IUpdateRoleAssociations) => updateRoleAssociations(arg), {
      onSuccess: () => {
        setShowAddModal(false);
        refetch();
        queryClient.invalidateQueries('GET_ROLE_ASSOCIATIONS');
      },
    }
  );

  const onAssociate = () => {
    if (departmentsOrEmployees) {
      const deletes = data?.departmentsOrEmployees.filter((member) => {
        return !departmentsOrEmployees.find((m) => m.ownerID === member.ownerID);
      });
      const adds = departmentsOrEmployees.filter((curMember) => {
        return !data?.departmentsOrEmployees.find((member) => {
          member.ownerID === curMember.ownerID;
        });
      });
      mutation.mutate({
        roleID: id as string,
        add: adds.map(({ type, ownerID }) => ({ type, ownerID })),
        delete: deletes?.map(({ id }) => id),
      });
    }
  };

  const onCancelAssociation = (records: EmployeeOrDepartmentOfRole[]) => {
    mutation.mutate({
      roleID: id as string,
      delete: records.map(({ id }) => id),
    });
  };

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }
  if (isError) {
    return <Error desc="something wrong" />;
  }

  return (
    <>
      <Modal
        title="角色关联员工与部门"
        onCancel={() => setShowAddModal(false)}
        className="owner-bind-modal"
        visible={showAddModal}
        footer={
          <div className="flex flex-row justify-between items-center">
            <Button
              className="bg-white hover:bg-gray-100 transition cursor-pointer mr-20 mb-0"
              textClassName="text-gray-600 ml-2"
              icon={<img src="/dist/images/icon_error.svg" />}
              onClick={() => setShowAddModal(false)}
            >
              取消
            </Button>
            <Button
              className="bg-gray-700 hover:bg-gray-900 transition cursor-pointer mb-0"
              textClassName="text-white ml-2"
              icon={<img src="/dist/images/icon_true.svg" />}
              onClick={onAssociate}
            >
              确定关联
            </Button>
          </div>
        }
      >
        <EmployeeOrDepartmentPicker
          departments={data?.departments}
          employees={data?.employees}
          onChange={setDepartmentsOrEmployees}
        />
      </Modal>
      <div className="flex items-center">
        <Switch
          className="mb-16"
          options={[{
            label: '员工',
            value: 1,
          }, {
            label: '部门',
            value: 2,
          }]}
          onChange={setShowBindType}
        />
        {!isSuper && (
          <Authorized authority={['accessControl/role/manage']}>
            <Button
              className="bg-gray-700 hover:bg-gray-900 transition mb-16 cursor-pointer"
              textClassName="text-white ml-2"
              icon={<img src="/dist/images/link.svg" />}
              onClick={() => setShowAddModal(true)}
            >
            关联员工与部门
            </Button>
          </Authorized>
        )}
      </div>
      <div
        className="overflow-scroll w-full pb-6 rounded-12"
        style={{ height: 'calc(100% - 42px)' }}
      >
        <DepartmentOrEmployeeTable
          isSuper={isSuper}
          roleID={id}
          onCancelAssociation={onCancelAssociation}
          type={showBindType as RoleBindType}
        />
      </div>
    </>
  );
}

import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from 'react-query';

import Button from '@c/button';
import Authorized from '@c/authorized';
import Switch from '@c/switch';
import EmployeeOrDepartmentPickerModal from '@c/employee-or-department-picker';
import toast from '@lib/toast';

import { updateRoleAssociations, IUpdateRoleAssociations, getRoleAssociations } from '../../api';
import DepartmentOrEmployeeTable from './department-or-employee-table';

export interface Props {
  roleID: string;
  isSuper: boolean;
}

export default function AssociateDepartmentEmployee({ roleID, isSuper }: Props) {
  const [showBindModal, setShowBindModal] = useState(false);
  const [showBindType, setShowBindType] = useState<string | number>(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery(
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

  const mutation = useMutation(
    (arg: IUpdateRoleAssociations) => updateRoleAssociations(arg), {
      onSuccess: () => {
        queryClient.invalidateQueries('GET_ROLE_ASSOCIATIONS');
        queryClient.invalidateQueries('GET_ROLE_ASSOCIATIONS_ALL');
      },
    }
  );

  async function onAssociate(
    departments: EmployeeOrDepartmentOfRole[],
    employees: EmployeeOrDepartmentOfRole[]
  ) {
    const newSets = [...departments, ...employees];
    const oldSets = data?.departmentsOrEmployees || [];
    const deletes = oldSets.filter((member) => {
      return !newSets.find((m) => m.ownerID === member.ownerID);
    });
    const adds = newSets.filter((member) => {
      return !oldSets.find((m) => m.ownerID === member.ownerID);
    });
    try {
      await mutation.mutateAsync({
        roleID: roleID as string,
        add: adds.map(({ type, ownerID }) => ({ type, ownerID })),
        delete: deletes?.map(({ id }) => id),
      });
      return true;
    } catch (e) {
      notify.error(e.message);
    }
  }

  function onCancelAssociation(records: EmployeeOrDepartmentOfRole[]) {
    mutation.mutate({
      roleID: roleID as string,
      delete: records.map(({ id }) => id),
    });
  }

  if (isError) {
    toast.error((error as string));
  }

  return (
    <>
      {showBindModal && !isLoading && !isError && (
        <EmployeeOrDepartmentPickerModal
          title="角色关联员工与部门"
          submitText="确定关联"
          onSubmit={onAssociate}
          onCancel={() => setShowBindModal(false)}
          employees={data?.employees}
          departments={data?.departments}
        />
      )}
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
              modifier="primary"
              className="mb-16 ml-2"
              iconName="link"
              onClick={() => setShowBindModal(true)}
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
          roleID={roleID}
          onCancelAssociation={onCancelAssociation}
          type={showBindType as RoleBindType}
        />
      </div>
    </>
  );
}

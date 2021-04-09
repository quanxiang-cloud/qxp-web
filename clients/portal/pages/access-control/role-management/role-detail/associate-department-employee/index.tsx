import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import Button from '@c/button';
import Authorized from '@c/authorized';
import Switch from '@c/switch';
import EmployeeOrDepartmentPickerModal from '@c/employee-or-department-picker-modal';
import { updateRoleAssociations, IUpdateRoleAssociations } from '../../api';

import DepartmentOrEmployeeTable from './department-or-employee-table';

export interface Props {
  roleID: string;
  isSuper: boolean;
}

export default function AssociateDepartmentEmployee({ roleID, isSuper }: Props) {
  const [showBindModal, setShowBindModal] = useState(false);
  const [showBindType, setShowBindType] = useState<string | number>(1);
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (arg: IUpdateRoleAssociations) => updateRoleAssociations(arg), {
      onSuccess: () => {
        setShowBindModal(false);
        queryClient.invalidateQueries('GET_ROLE_ASSOCIATIONS');
        queryClient.invalidateQueries('GET_ROLE_ASSOCIATIONS_ALL');
      },
    }
  );

  function onAssociate(
    newSets: EmployeeOrDepartmentOfRole[],
    oldSets: EmployeeOrDepartmentOfRole[]
  ) {
    const deletes = oldSets.filter((member) => {
      return !newSets.find((m) => m.ownerID === member.ownerID);
    });
    const adds = newSets.filter((member) => {
      return !oldSets.find((m) => m.ownerID === member.ownerID);
    });
    mutation.mutate({
      roleID: roleID as string,
      add: adds.map(({ type, ownerID }) => ({ type, ownerID })),
      delete: deletes?.map(({ id }) => id),
    });
  }

  function onCancelAssociation(records: EmployeeOrDepartmentOfRole[]) {
    mutation.mutate({
      roleID: roleID as string,
      delete: records.map(({ id }) => id),
    });
  }

  return (
    <>
      <EmployeeOrDepartmentPickerModal
        onOk={onAssociate}
        visible={showBindModal}
        roleID={roleID}
        onCancel={() => setShowBindModal(false)}
      />
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
              className="bg-gray-700 hover:bg-gray-900 transition mb-16 cursor-pointer
               text-white ml-2"
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

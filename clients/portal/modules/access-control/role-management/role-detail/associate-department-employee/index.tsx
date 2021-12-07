import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from 'react-query';

import Button from '@c/button';
import Authorized from '@c/authorized';
import RadioButtonGroup from '@c/radio/radio-button-group';
import EmployeeOrDepartmentPickerModal from '@c/employee-or-department-picker';
import toast from '@lib/toast';

import { updateRoleAssociations, IUpdateRoleAssociations, getRoleAssociations } from '../../api';
import DepartmentOrEmployeeTable from './department-or-employee-table';

export interface Props {
  roleID: string;
  isSuper: boolean;
}

export default function AssociateDepartmentEmployee({ roleID, isSuper }: Props): JSX.Element {
  const [showBindModal, setShowBindModal] = useState(false);
  const [showBindType, setShowBindType] = useState<number>(1);
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
    },
  );

  async function onAssociate(
    departments: EmployeeOrDepartmentOfRole[],
    employees: EmployeeOrDepartmentOfRole[],
  ): Promise<true | undefined> {
    const newSets = [...departments, ...employees];
    const oldSets = data?.departmentsOrEmployees || [];
    const deletes = oldSets.filter((member: { ownerID: string; }) => {
      return !newSets.find((m) => m.ownerID === member.ownerID);
    });
    const adds = newSets.filter((member) => {
      return !oldSets.find((m: { ownerID: string; }) => m.ownerID === member.ownerID);
    });
    try {
      await mutation.mutateAsync({
        roleID: roleID as string,
        add: adds.map(({ type, ownerID }) => ({ type, ownerID })),
        delete: deletes?.map(({ id }: { id: string }) => id),
      });
      return true;
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  function onCancelAssociation(records: EmployeeOrDepartmentOfRole[]): void {
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
      {!isSuper && (
        <div className="flex justify-between items-center mb-8 w-full">
          <Authorized authority={['accessControl/role/manage']}>
            <Button
              modifier="primary"
              className="text-12"
              iconName="link"
              onClick={() => setShowBindModal(true)}
            >
              关联员工与部门
            </Button>
          </Authorized>
          <RadioButtonGroup
            className="mr-16 text-12"
            radioBtnClass="bg-white"
            currentValue={showBindType}
            listData={[
              {
                label: '按员工',
                value: '1',
              }, {
                label: '按部门',
                value: '2',
              },
            ]}
            onChange={(value) => setShowBindType(Number(value))}
          />
        </div>
      )}
      <DepartmentOrEmployeeTable
        isSuper={isSuper}
        roleID={roleID}
        onCancelAssociation={onCancelAssociation}
        type={showBindType as RoleBindType}
      />
    </>
  );
}

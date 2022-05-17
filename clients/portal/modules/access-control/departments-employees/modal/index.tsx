import React from 'react';

import EmployeesInfoModal from './employees-info-modal';
import EditEmployeesModal from './edit-employees-modal';
import ImportEmployeesModal from './import-employees-modal';
import ResetPasswordModal from './reset-password-modal';
import AlterUserStateModal from './alert-user-state-modal';
import AdjustDepModal from './adjust-dep-modal';
import LeaderHandleModal from './leader-handle-modal';
import ExportEmployees from '../export-employees';
import ImportExportEmployees from './import-export-employees-modal';
import { UserStatus } from '../type';

export type ModalType = '' | 'edit_employees' | 'import_export_employees' | 'reset_password' |
  'user_state_normal' | 'user_state_disabled' | 'user_state_delete' | 'adjust_dep' |
  'leader_handle' | 'export_employees' | 'show_employees' | 'import_employees';

type Props = {
  modalType: ModalType;
  selectedUsers: Employee[];
  currUser: Employee;
  department: Department;
  closeModal: () => void;
};

export default function EmployeeModal({
  modalType,
  selectedUsers,
  currUser,
  department,
  closeModal,
}: Props): JSX.Element {
  function handleEmployeesExport(ids: string[]): void {
    // TODO: wait export service
    // getUserAdminInfo('', {
    //   useStatus: 1,
    //   page: 1,
    //   depIDs: ids,
    //   limit: 10000,
    // }).then((res) => {
    //   const { data } = res;
    //   const newData: Employee[] = data.map((user) => {
    //     user.depName = user.dep && user.dep.name;
    //     return user;
    //   });
    //   exportEmployees(newData);
    //   closeModal();
    // }).catch((error) => {
    //   toast.error(error);
    // });
  }

  function showUserStateModel(): boolean {
    return ['user_state_normal', 'user_state_delete', 'user_state_disable'].includes(modalType);
  }

  function getCurUserStatue(): UserStatus {
    if (modalType === 'user_state_delete') return UserStatus.delete;
    if (modalType === 'user_state_disabled') return UserStatus.disable;
    return UserStatus.normal;
  }

  return (
    <>
      {modalType === 'show_employees' && (
        <EmployeesInfoModal user={currUser} closeModal={closeModal} />
      )}
      { modalType === 'leader_handle' &&
        (<LeaderHandleModal user={currUser} closeModal={closeModal} />)}
      { modalType === 'adjust_dep' &&
        (<AdjustDepModal users={selectedUsers} closeModal={closeModal} />)}
      { modalType === 'edit_employees' &&
        (<EditEmployeesModal user={currUser} closeModal={closeModal} />)}
      {modalType === 'export_employees' && (
        <ExportEmployees closeModal={closeModal} onSubmit={handleEmployeesExport} />
      )}
      { modalType === 'import_export_employees' &&
        (<ImportEmployeesModal currDepId={department.id} closeModal={closeModal} />)}
      {modalType === 'import_employees' && (
        <ImportExportEmployees closeModal={closeModal} />
      )}
      {
        showUserStateModel() && (<AlterUserStateModal
          status={getCurUserStatue()}
          user={currUser}
          closeModal={closeModal}
        />)
      }
      {
        modalType === 'reset_password' && (<ResetPasswordModal
          selectedUsers={selectedUsers}
          closeModal={closeModal}
        />)
      }
    </>
  );
}

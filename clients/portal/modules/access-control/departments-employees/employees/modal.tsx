import React from 'react';
import { observer } from 'mobx-react';

import EmployeesInfoModal from '../modal/employees-info-modal';
import EditEmployeesModal from '../modal/edit-employees-modal';
import ImportEmployeesModal from '../modal/import-employees-modal';
import ResetPasswordModal from '../modal/reset-password-modal';
import AlterUserStateModal from '../modal/alert-user-state-modal';
import AdjustDepModal from '../modal/adjust-dep-modal';
import LeaderHandleModal from '../modal/leader-handle-modal';
import ExportEmployees from '../export-employees';
import ImportExportEmployees from '../modal/import-export-employees-modal';
import { UserStatus } from '../type';
import store from './store';

export type ModalType = '' | 'edit_employees' | 'import_export_employees' | 'reset_password' |
  'user_state_normal' | 'user_state_disabled' | 'user_state_delete' | 'adjust_dep' |
  'leader_handle' | 'export_employees' | 'show_employees' | 'import_employees';

function EmployeeModal(): JSX.Element {
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

  function closeModal(): void {
    store.closeModal();
  }

  function isShowUserStateModel(): boolean {
    return ['user_state_normal', 'user_state_delete', 'user_state_disabled'].includes(store.modalType);
  }

  function getCurUserStatue(): UserStatus {
    if (store.modalType === 'user_state_delete') return UserStatus.delete;
    if (store.modalType === 'user_state_disabled') return UserStatus.disable;
    return UserStatus.normal;
  }

  return (
    <>
      {store.modalType === 'show_employees' && (
        <EmployeesInfoModal user={store.currentUser} closeModal={closeModal} />
      )}
      { store.modalType === 'leader_handle' &&
        (<LeaderHandleModal user={store.currentUser} closeModal={closeModal} />)}
      { store.modalType === 'adjust_dep' &&
        (<AdjustDepModal users={store.selectedUsers} closeModal={closeModal} />)}
      { store.modalType === 'edit_employees' &&
        (<EditEmployeesModal user={store.currentUser} closeModal={closeModal} />)}
      {store.modalType === 'export_employees' && (
        <ExportEmployees closeModal={closeModal} onSubmit={handleEmployeesExport} />
      )}
      { store.modalType === 'import_export_employees' && store.department &&
        (<ImportEmployeesModal currDepId={store.department.id} closeModal={closeModal} />)}
      {store.modalType === 'import_employees' && (
        <ImportExportEmployees closeModal={closeModal} />
      )}
      {
        isShowUserStateModel() && (<AlterUserStateModal
          status={getCurUserStatue()}
          user={store.currentUser}
          closeModal={closeModal}
        />)
      }
      {
        store.modalType === 'reset_password' && (<ResetPasswordModal
          selectedUsers={[store.currentUser]}
          closeModal={closeModal}
        />)
      }
    </>
  );
}

export default observer(EmployeeModal);

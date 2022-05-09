import React, { useState } from 'react';
import { observer } from 'mobx-react';

import SearchDepartment from './search-department';
import SearchEmployees from './search-employees';
import EmployeesInfoModal from '../modal/employees-info-modal';

import './index.scss';

type Props = {
  searchWord: string;
  onChange?: (department: Department) => void;
};

function SearchOrganize({ searchWord, onChange }: Props): JSX.Element {
  const [selectedUser, setSelectedUser] = useState<Employee>();

  function changeSelectedUser(user: Employee): void {
    setSelectedUser(user);
  }
  return (
    <div>
      <SearchEmployees searchWord={searchWord} onChange={changeSelectedUser}/>
      <SearchDepartment searchWord={searchWord} onChange={onChange}/>
      {selectedUser &&
        (<EmployeesInfoModal user={selectedUser} closeModal={() => setSelectedUser(undefined)} />)}
    </div>
  );
}

export default observer(SearchOrganize);

import React, { useState } from 'react';
import cs from 'classnames';

import Loading from '@c/loading';

import useSearchEmployees from '../hooks/useSearchEmployees';
import UserCell from '../table-column/user-cell';

type Props = {
  searchWord: string;
  onChange?: (user: Employee) => void;
};

function SearchEmployees({ searchWord, onChange }: Props): JSX.Element {
  const [selectedUser, setSelectedUser] = useState<Employee>();

  const { employeesList, isLoading } = useSearchEmployees({ name: searchWord });

  function handleClick(user: Employee): void {
    setSelectedUser(user);
    onChange?.(user);
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!employeesList?.total) {
    return <></>;
  }

  return (
    <div>
      <span className='search-title'>员工({employeesList?.total})</span>
      {employeesList?.users.map((user) => (
        <div
          key={user.id}
          className={cs('search-item flex items-center', user === selectedUser && 'is-selected')}
          onClick={() => handleClick(user)}
        >
          <UserCell user={user} />
        </div>
      ))}
    </div>
  );
}

export default SearchEmployees;

import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import TextHeader from '@c/text-header';
import { Tag } from '@one-for-all/headless-ui';

import OwnerStore from './store';

export interface ISelectedList {
  className?: string;
  ownerStore: OwnerStore;
}

export default observer(function SelectedList({ className, ownerStore }: ISelectedList) {
  const users = ownerStore.owners.filter(({ type }) => type === 1);
  const departments = ownerStore.owners.filter(({ type }) => type === 2);
  const isFirstLoad = useRef<boolean>(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      departments.forEach((department) => {
        ownerStore.departmentTreeStore.toggleCheck(department.ownerID);
      });
      isFirstLoad.current = false;
    }
  }, [departments]);

  const onRemove = (owner: EmployeeOrDepartmentOfRole): void => {
    ownerStore.onRemove(owner);
    ownerStore.departmentTreeStore.toggleCheck(owner.ownerID);
  };

  const onClear = (): void => {
    ownerStore.owners.forEach((owner) => {
      ownerStore.departmentTreeStore.toggleCheck(owner.ownerID);
    });
    ownerStore.onClear();
  };

  const tagRender = ({
    ownerName,
    departmentName,
    ownerID,
    ...others
  }: EmployeeOrDepartmentOfRole): JSX.Element => {
    return (
      <Tag
        id={ownerID}
        key={ownerID}
        className='mr-8 mb-8 flex items-center'
        style={others.type === 2 ? {
          backgroundColor: '#FFFBEB',
          color: 'var(--yellow-600)',
        } : {
          backgroundColor: 'var(--blue-100)',
          color: 'var(--blue-600)',
        }}
        onDelete={() =>
          onRemove({
            ownerName,
            departmentName,
            ownerID,
            ...others,
          })
        }
        label={
          (
            <div className="truncate inline-block">
              {ownerName && (<span className={cs('mr-2')}>{ownerName}</span>)}
              {departmentName && (
                <span className={cs('text-gray-400')}>
                  {`${ownerName ? `(${departmentName})` : departmentName}`}
                </span>
              )}
              {!ownerName && !departmentName && (
                <span>{ownerID}</span>
              )}
            </div>)
        }
      />
    );
  };

  return (
    <div className={cs('pl-20 pr-4 pb-5', className)}>
      <TextHeader
        title="已选"
        itemTitleClassName="text-h6"
        descClassName="text-caption-no-color text-gray-400"
        desc={`(${users.length}个员工${departments.length ? `, ${departments.length}个部门` : ''})`}
        action={
          (<span
            className="cursor-pointer text-body2-no-color text-blue-600 flex
            items-center justify-center"
            onClick={onClear}
          >
            清空
          </span>)
        }
      />
      <div
        className="flex flex-row flex-wrap content-start overflow-scroll"
        style={{ height: 'calc(100% - 42px)', width: '250px' }}
      >
        {users.map(tagRender)}
        {departments.map(tagRender)}
      </div>
    </div>
  );
});

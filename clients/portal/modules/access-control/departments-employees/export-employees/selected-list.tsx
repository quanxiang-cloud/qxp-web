import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';

import TextHeader from '@c/text-header';
import Tag from '@c/tag';

import OwnerStore from './owner-store';

export interface ISelectedList {
  className?: string;
  ownerStore: OwnerStore;
}

export default observer( function SelectedList({ className, ownerStore }: ISelectedList) {
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
        key={ownerID}
        className={cs('mr-8 mb-8 tag-border-radius relative bind-role-selector-tag', {
          'bg-blue-100': others.type === 1,
          'bg-amber-50': others.type === 2,
        })}
        style={{
          backgroundColor: others.type === 1 ? 'var(--blue-100)' : '#FFFBEB',
          transition: 'all .1s linear',
          lineHeight: '24px',
          maxWidth: '356px',
        }}
        onDelete={() =>
          onRemove({
            ownerName,
            departmentName,
            ownerID,
            ...others,
          })
        }
        value={(
          <div className="truncate inline-block pr-16">
            {ownerName && (<span className={cs('mr-2', {
              'text-blue-600': others.type === 1,
              'text-yellow-600': others.type === 2,
            })}>{ownerName}</span>)}
            {departmentName && (
              <span className={cs('text-gray-400 mr-1', {
                'text-yellow-600': others.type === 2,
              })}>{`${
                  ownerName ? `(${departmentName})` : departmentName
                }`}</span>
            )}
            {!ownerName && !departmentName && (
              <span className="text-blue-600 mr-2">{ownerID}</span>
            )}
          </div>
        )}
      />
    );
  };

  return (
    <div className={cs('pl-20 pr-4 pb-5', className)}>
      <TextHeader
        title="已选"
        itemTitleClassName="text-h6"
        descClassName="text-caption-no-color text-gray-400"
        desc={`${departments.length}个部门`}
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
        className="flex flex-row flex-wrap content-start overflow-auto"
        style={{ height: 'calc(100% - 42px)', width: '250px' }}
      >
        {departments.map(tagRender)}
      </div>
    </div>
  );
});

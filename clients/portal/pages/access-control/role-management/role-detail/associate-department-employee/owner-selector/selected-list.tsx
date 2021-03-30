import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { Tag } from '@QCFE/lego-ui';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import TextHeader from '@c/text-header';
import { IOwner } from '@portal/api/role-management';

import OwnerStore from './store';

export interface ISelectedList {
  className?: string;
  ownerStore: OwnerStore;
}

export default observer( function SelectedList({ className, ownerStore }: ISelectedList) {
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

  const onRemove = (owner: IOwner) => {
    ownerStore.onRemove(owner);
    ownerStore.departmentTreeStore.toggleCheck(owner.ownerID);
  };

  const onClear = () => {
    ownerStore.owners.forEach((owner) => {
      ownerStore.departmentTreeStore.toggleCheck(owner.ownerID);
    });
    ownerStore.onClear();
  };

  const tagRender = ({ ownerName, departmentName, ownerID, ...others }: IOwner) => {
    return (
      <Tag
        key={ownerID}
        closable
        className={twCascade('mr-8 mb-8 tag-border-radius relative bind-role-selector-tag', {
          'bg-blue-100': others.type === 1,
          'bg-amber-50': others.type === 2,
        })}
        style={{
          backgroundColor: others.type === 1 ? 'var(--blue-100)' : '#FFFBEB',
          transition: 'all .1s linear',
          lineHeight: '24px',
          maxWidth: '356px',
        }}
        onClose={() =>
          onRemove({
            ownerName,
            departmentName,
            ownerID,
            ...others,
          })
        }
      >
        <div className="truncate inline-block pr-16">
          {ownerName && <span className={twCascade('mr-2', {
            'text-blue-600': others.type === 1,
            'text-yellow-600': others.type === 2,
          })}>{ownerName}</span>}
          {departmentName && (
            <span className={twCascade('text-gray-400 mr-1', {
              'text-yellow-600': others.type === 2,
            })}>{`${
                ownerName ? `(${departmentName})` : departmentName
              }`}</span>
          )}
          {!ownerName && !departmentName && (
            <span className="text-blue-600 mr-2">{ownerID}</span>
          )}
        </div>
      </Tag>
    );
  };

  return (
    <div className={twCascade('pl-20 pr-4 pb-5', className)}>
      <TextHeader
        title="已选"
        itemTitleClassName="text-h6"
        descClassName="text-caption-no-color text-gray-400"
        desc={`(${users.length}个员工${departments.length ? `, ${departments.length}个部门` : ''})`}
        action={
          <span
            className="cursor-pointer text-body2-no-color text-blue-600 flex
            items-center justify-center"
            onClick={onClear}
          >
            清空
          </span>
        }
      />
      <div
        className="flex flex-row flex-wrap content-start overflow-scroll"
        style={{ height: 'calc(100% - 42px)', width: '360px' }}
      >
        {users.map(tagRender)}
        {departments.map(tagRender)}
      </div>
    </div>
  );
});

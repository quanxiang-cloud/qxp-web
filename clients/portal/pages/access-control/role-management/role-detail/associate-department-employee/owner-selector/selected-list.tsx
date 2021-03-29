import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';

import TextHeader from '@c/text-header';
import { Tag } from '@QCFE/lego-ui';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import OwnerStore from './store';
import { IOwner } from '../../../api';

export interface ISelectedList {
  className?: string;
  ownerStore: OwnerStore;
}

export const SelectedList = observer(({ className, ownerStore }: ISelectedList) => {
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
    // const nodeMap = ownerStore.departmentTreeStore.toggleCheck(owner.id, 'unchecked');
    // if (!nodeMap) {
    //   return;
    // }
    // Object.entries(nodeMap).forEach(([key, node]) => {
    //   if (node.checkStatus === 'unchecked' || node.checkStatus === 'indeterminate') {
    //     ownerStore.removeOwner(key);
    //   }
    // });
  };

  const onClear = () => {
    ownerStore.owners.forEach((owner) => {
      // ownerStore.departmentTreeStore.toggleCheck(owner.id, 'unchecked');
      ownerStore.departmentTreeStore.toggleCheck(owner.ownerID);
    });
    ownerStore.onClear();
  };

  const tagRender = ({ ownerName, departmentName, ownerID, ...others }: IOwner) => {
    return (
      <Tag
        key={ownerID}
        closable
        className={twCascade('mr-8 mb-8 tag-border-radius', {
          'bg-blue-100': others.type === 1,
          'bg-amber-50': others.type === 2,
        })}
        style={{
          backgroundColor: others.type === 1 ? 'var(--blue-100)' : '#FFFBEB',
          transition: 'all .1s linear',
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
      <div className="flex flex-row flex-wrap">
        {users.map(tagRender)}
        {departments.map(tagRender)}
      </div>
    </div>
  );
});

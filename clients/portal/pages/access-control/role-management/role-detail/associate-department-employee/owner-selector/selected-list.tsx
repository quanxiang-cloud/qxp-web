import React, { MouseEvent } from 'react';
import { observer } from 'mobx-react';

import { TextHeader } from '@portal/components/text-header';
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

  const onRemove = (owner: IOwner) => {
    ownerStore.onRemove(owner);
    ownerStore.departmentTreeStore.toggleCheck(owner.id);
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
    ownerStore.onClear();
    ownerStore.owners.forEach((owner) => {
      // ownerStore.departmentTreeStore.toggleCheck(owner.id, 'unchecked');
      ownerStore.departmentTreeStore.toggleCheck(owner.id);
    });
  };

  const tagRender = ({ ownerName, departmentName, ownerID, ...others }: IOwner) => {
    return (
      <Tag
        key={ownerID}
        closable
        className={twCascade('mr-2 mb-dot-4', {
          'bg-blue-100': others.type === 1,
          'bg-amber-50': others.type === 2,
        })}
        style={{
          borderRadius: '0.2rem 0',
          backgroundColor: others.type === 1 ? '#F0F6FF' : '#FFFBEB',
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
          <span className="text-gray-400 mr-1">{`${
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
    <div className={twCascade('px-4 pb-5', className)}>
      <TextHeader
        title="已选"
        desc={`(${users.length}个员工${departments.length ? `, ${departments.length}个部门` : ''})`}
        action={
          <span
            className="cursor-pointer text-1-dot-4 text-blue-600 flex
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

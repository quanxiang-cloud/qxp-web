import React, { MouseEvent } from 'react';

import { TextHeader } from '@portal/components/text-header';
import { Tag } from '@QCFE/lego-ui';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import { IOwner } from '../../../api';

export interface ISelectedList {
  ownerList: IOwner[];
  onClear: (e: MouseEvent<HTMLDivElement>) => void;
  onRemoveItem: (item: IOwner) => void;
  className?: string;
}

export const SelectedList = ({ ownerList, onClear, onRemoveItem, className }: ISelectedList) => {
  const users = ownerList.filter(({ type }) => type === 1);
  const departments = ownerList.filter(({ type }) => type === 2);

  return (
    <div className={twCascade('px-4 pb-5', className)}>
      <TextHeader
        title="已选"
        desc={`(${users.length}个员工${departments.length ? `, ${departments.length}个部门` : ''})`}
        action={
          <span
            className="cursor-pointer text-dot-7 text-blue-primary flex items-center justify-center"
            onClick={onClear}
          >
            清空
          </span>
        }
      />
      <div className="flex flex-row flex-wrap">
        {ownerList.map(({ ownerName, departmentName, ownerID, ...others }) => (
          <Tag
            key={ownerID}
            closable
            className={twCascade('mr-2 mb-dot-4', {
              'bg-blue-light': others.type === 1,
              'bg-yellow-second': others.type === 2,
            })}
            style={{
              borderRadius: '0.2rem 0',
              backgroundColor: others.type === 1 ? '#F0F6FF' : '#FFFBEB',
              transition: 'all .1s linear',
            }}
            onClose={() =>
              onRemoveItem({
                ownerName,
                departmentName,
                ownerID,
                ...others,
              })
            }
          >
            {ownerName && <span className={twCascade('mr-2', {
              'text-blue-primary': others.type === 1,
              'text-yellow-primary': others.type === 2,
            })}>{ownerName}</span>}
            {departmentName && (
              <span className="text-dark-four mr-1">{`${
                ownerName ? `(${departmentName})` : departmentName
              }`}</span>
            )}
            {!ownerName && !departmentName && (
              <span className="text-blue-primary mr-2">{ownerID}</span>
            )}
          </Tag>
        ))}
      </div>
    </div>
  );
};

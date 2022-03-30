import React from 'react';
import cs from 'classnames';

import Icon from '@c/icon';
import { Tag } from '@one-for-all/headless-ui';

import { tagBackgroundColorMap, tagIconNameMap } from './constants';

export interface Member {
  type: 1 | 2;
  id: string;
  ownerName: string;
}

interface Props {
  member: Member;
  onDelete: (id: string) => void;
}

export default function Member({ member, onDelete }: Props): JSX.Element {
  return (
    <Tag
      className="mr-8 rounded-tl-4 rounded-br-4 mb-8 overflow-hidden h-24"
      style={{
        backgroundColor: tagBackgroundColorMap[member.type],
        paddingLeft: 0,
      }}
      key={member.id}
      id={member.id}
      label={(
        <div
          className="rounded-tl-4 flex items-center mr-4 h-full"
        >
          <div
            className={cs('flex w-24 justify-center items-center mr-8 h-full', {
              'bg-blue-600': member.type === 1,
              'bg-yellow-600': member.type === 2,
            })}
          >
            <Icon name={tagIconNameMap[member.type]} className="text-white" />
          </div>
          <span
            className={cs({
              'text-blue-600': member.type === 1,
              'text-yellow-600': member.type === 2,
            })}
          >
            {member.ownerName}
          </span>
        </div>
      )}
      deleteIconSize={16}
      onDelete={() => onDelete(member.id)}
    />
  );
}

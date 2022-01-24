import React, { Fragment } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

import { ApprovePerson } from '@flow/content/editor/type';

import ValidatingTips from '../validating-tips';
import Member, { Member as MemberProps } from './member';

interface Props {
  onDelete: (id: string) => void;
  validating: boolean;
  value: ApprovePerson;
  typeText?: string;
  onAdd: () => void;
}

export default function SpecifyPerson(props: Props): null | JSX.Element {
  const { onDelete, validating, value, typeText, onAdd } = props;
  const { departments, users: employees } = value;

  const members = departments.concat(employees);

  return (
    <Fragment>
      {!!members.length && (
        <div className="mt-8 mb-12 py-8 px-12 border border-gray-300 corner-2-8-8-8">
          {members.map((member: MemberProps) => {
            return <Member member={member} key={member.id} onDelete={onDelete} />;
          })}
        </div>
      )}
      <div
        className={cs(
          'flex items-center border border-dashed corner-8-2-8-8',
          'py-5 text-button mt-8 justify-center cursor-pointer h-32', {
            'border-gray-300': !validating || value.users?.length,
            'border-red-300': validating && !value.users?.length,
          },
        )}
        role="button"
        tabIndex={0}
        onClick={onAdd}
      >
        <Icon name="add" className="mr-8" size={20} />
        <span>
          添加{typeText}
        </span>
      </div>
      <ValidatingTips
        validating={validating && !value.users?.length}
        tips={`请添加${typeText}`}
      />
    </Fragment>
  );
}

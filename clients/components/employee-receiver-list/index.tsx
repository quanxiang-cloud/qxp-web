import React from 'react';
import cs from 'classnames';
import Icon from '@c/icon';

import './index.scss';

interface Props {
  className?: string;
  receivers: Array<Qxp.MsgReceiver>;
  readonly?: boolean;
  onRemove?: (id: string) => void;
}

export default function Receivers({
  className,
  receivers,
  readonly,
  onRemove,
}: Props) {
  if (!receivers.length) {
    return null;
  }
  return (
    <div className={cs('employee-receiver', className)}>
      {receivers.map(({ id, name, ownerName, departmentName, type }: Qxp.MsgReceiver) => {
        const realName = name ?? ownerName ?? departmentName;

        return (
          <span className={cs('receiver', {
            ['is-employee']: type === 1,
            ['is-department']: type === 2,
          })} key={id}>
            <span>{realName}</span>
            {!readonly && (
              <Icon
                name='close'
                className={'btn-close'}
                onClick={() => onRemove && onRemove(id)}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}

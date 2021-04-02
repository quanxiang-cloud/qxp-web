import React, { useState, ChangeEventHandler, FocusEventHandler } from 'react';
import classnames from 'classnames';
import { uuid } from '@lib/utils';

import SvgIcon from '@c/icon';

interface Props {
  label: string;
  name: string;
  layout?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  errorMessage?: string;
  className?: string;
}

export default function PassWord({
  label,
  name,
  layout = 'vertical',
  onChange,
  onBlur,
  errorMessage,
  className,
}: Props) {
  const [type, setType] = useState<string>('text');
  const id = uuid();

  return (
    <div
      className={classnames('flex mb-24', {
        'flex-col': layout === 'vertical',
        'items-center': layout !== 'vertical',
      }, className)}
    >
      <label className="text-body2 mb-8" htmlFor={id}>{label}</label>
      <div className="relative">
        <input
          name={name}
          className={classnames('input-border-radius border pr-32 w-full outline-none pl-4', {
            'border-gray-300': !errorMessage,
            'border-red-600': errorMessage,
          })}
          type={type}
          id={id}
          onChange={onChange}
          onBlur={onBlur}
        />
        <SvgIcon
          className="absolute right-6 top-1/2 transform -translate-y-1/2 cursor-pointer"
          name={type === 'password' ? 'visibility_off' : 'visibility'}
          onClick={() => setType(type === 'text' ? 'password' : 'text')}
        />
      </div>
      {errorMessage && (
        <span className="text-caption-no-color text-red-600">{errorMessage}</span>
      )}
    </div>
  );
}

import React, { useRef, ChangeEvent } from 'react';
import { useKey } from 'react-use';
import cs from 'classnames';

interface Props {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement> | string) => void;
  className?: string;
}

export default function InputEditor({ value, onChange, className = '' }: Props): JSX.Element {
  const ref = useRef<HTMLInputElement | null>(null);
  useKey(
    (e) => e.key === 'Enter',
    () => ref.current?.blur(),
    { target: ref.current, event: 'keydown' },
    [ref.current],
  );

  return (
    <div className={cs('input-editor-wrap', className)}>
      <input
        ref={ref}
        className="text-caption-no-color-weight text-gray-400 input-editor"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

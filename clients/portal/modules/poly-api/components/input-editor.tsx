import React, { useCallback, useRef, ChangeEvent } from 'react';
import { useKey } from 'react-use';
import cs from 'classnames';

interface Props {
  type?: 'text' | 'number';
  className?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function InputEditor({ value, onChange, type = 'text', className = '' }: Props): JSX.Element {
  const ref = useRef<HTMLInputElement | null>(null);
  useKey(
    (e) => e.key === 'Enter',
    () => ref.current?.blur(),
    { target: ref.current, event: 'keydown' },
    [ref.current],
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className={cs('input-editor-wrap', className)}>
      <input
        ref={ref}
        className="text-caption-no-color-weight text-gray-400 input-editor"
        value={value}
        onChange={handleChange}
        type={type}
      />
    </div>
  );
}

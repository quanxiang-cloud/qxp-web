import React, { useCallback, useRef, ChangeEvent } from 'react';
import { useKey } from 'react-use';
import cs from 'classnames';

interface Props {
  type?: 'text' | 'number';
  className?: string;
  value: string;
  onChange: (value: string) => void;
  autoMode?: boolean;
}

export default function InputEditor(
  { value, onChange, type = 'text', className = '', autoMode = false }: Props,
): JSX.Element {
  const ref = useRef<HTMLInputElement | null>(null);
  const labelRef = useRef<HTMLLabelElement | null>(null);
  useKey(
    (e) => e.key === 'Enter',
    () => ref.current?.blur(),
    { target: ref.current, event: 'keydown' },
    [ref.current],
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    onChange(value);
    if (labelRef.current) {
      labelRef.current.innerHTML = value;
    }
  }, [onChange]);

  const extraClassNames = autoMode ? 'absolute w-full h-full left-0' : '';

  return (
    <div className={cs('input-editor-wrap', className)} style={{ minWidth: 44 }}>
      {autoMode && (
        <label ref={labelRef} id="label" className="inline-block" style={{ visibility: 'hidden' }}></label>
      )}
      <input
        ref={ref}
        className={cs('text-caption-no-color-weight text-gray-400 input-editor', extraClassNames)}
        value={value}
        onChange={handleChange}
        type={type}
      />
    </div>
  );
}

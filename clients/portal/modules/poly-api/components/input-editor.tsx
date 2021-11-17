import React, { useCallback, useRef, ChangeEvent, FocusEvent, useEffect } from 'react';
import { useKey } from 'react-use';
import cs from 'classnames';

import toast from '@lib/toast';

interface Props {
  type?: 'text' | 'number';
  className?: string;
  value: string;
  onChange: (value: string) => void;
  autoMode?: boolean;
  changeOnBlur?: boolean;
  limit?: number;
}

export default function InputEditor({
  value, onChange, type = 'text', className = '', autoMode = false, changeOnBlur = true, limit = 30,
}: Props): JSX.Element {
  const ref = useRef<HTMLInputElement | null>(null);
  const labelRef = useRef<HTMLLabelElement | null>(null);
  useKey(
    (e) => e.key === 'Enter',
    () => ref.current?.blur(),
    { target: ref.current, event: 'keydown' },
    [ref.current],
  );

  useEffect(() => {
    if (!changeOnBlur || !ref.current) {
      return;
    }
    ref.current.value = value;
  }, [value, changeOnBlur]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    if (limit && value.length > limit) {
      value = value.slice(0, limit);
      e.target.value = value;
      toast.error(`最大长度允许${limit}个字符`);
    }
    if (labelRef.current) {
      labelRef.current.innerHTML = value;
    }
    !changeOnBlur && onChange(value);
  }, [onChange, changeOnBlur]);

  const handleBlur = useCallback((e: FocusEvent<HTMLInputElement>) => {
    if (changeOnBlur) {
      onChange(e.target.value);
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
        value={changeOnBlur ? undefined : value}
        defaultValue={changeOnBlur ? value : undefined}
        onChange={handleChange}
        onBlur={changeOnBlur ? handleBlur : undefined}
        type={type}
      />
    </div>
  );
}

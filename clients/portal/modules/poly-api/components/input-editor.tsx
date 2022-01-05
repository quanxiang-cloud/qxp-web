import React, { useCallback, useRef, ChangeEvent, FocusEvent, useEffect, CSSProperties } from 'react';
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
  placeholder?: string;
  extraClassName?: string;
  style?: CSSProperties;
  limit?: number;
  includeChinese?: boolean;
}

function hasChinese(str: string): boolean {
  return /[\u4E00-\u9FA5]/g.test(str);
}

export default function InputEditor({
  value,
  onChange,
  type = 'text',
  className = '',
  autoMode = false,
  changeOnBlur,
  placeholder,
  extraClassName = '',
  style,
  limit,
  includeChinese = false,
}: Props): JSX.Element {
  const ref = useRef<HTMLInputElement | null>(null);
  const labelRef = useRef<HTMLLabelElement | null>(null);
  useKey(
    (e) => e.key === 'Enter',
    () => ref.current?.blur(),
    { target: ref.current, event: 'keydown' },
    [ref.current],
  );

  const syncValueToLabel = useCallback((val: string = value): void => {
    if (labelRef.current) {
      labelRef.current.innerHTML = val;
    }
  }, [value, labelRef.current]);

  useEffect(syncValueToLabel, [value]);

  useEffect(() => {
    if (changeOnBlur && ref.current) {
      ref.current.value = value;
    }
  }, [value, changeOnBlur]);

  const onChangeProxy = useCallback((__value: string): void => {
    let _value = __value;
    if (limit && _value.length > limit) {
      toast.error(`名称不能超过${limit}个字符`);
      _value = _value.slice(0, limit);
    }
    if (!includeChinese && hasChinese(_value)) {
      toast.error('名称不能包含中文');
      _value = value;
    }
    if (changeOnBlur && ref.current) {
      ref.current.value = _value;
      syncValueToLabel(_value);
    }
    onChange(_value);
  }, [onChange, value, includeChinese, limit, ref.current, syncValueToLabel]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    changeOnBlur && syncValueToLabel(e.target.value);
    !changeOnBlur && onChangeProxy(e.target.value);
  }, [onChangeProxy, changeOnBlur, syncValueToLabel]);

  const handleBlur = useCallback((e: FocusEvent<HTMLInputElement>) => {
    changeOnBlur && value !== e.target.value && onChangeProxy(e.target.value);
  }, [onChangeProxy, value, changeOnBlur]);

  const extraClassNames = autoMode ? 'absolute w-full h-full left-0 top-0' : 'w-full';

  return (
    <div
      className={cs('input-editor-wrap', className)}
      style={{ minWidth: placeholder ? placeholder.length * 12 : 20, maxWidth: 196, ...style }}
    >
      {autoMode && (
        <label ref={labelRef} id="label" className="inline-block" style={{ visibility: 'hidden' }}></label>
      )}
      <input
        ref={ref}
        className={
          cs('text-caption-no-color-weight text-gray-400 input-editor', extraClassNames, extraClassName)
        }
        {...(!changeOnBlur ? { value } : {})}
        defaultValue={changeOnBlur ? value : undefined}
        onChange={handleChange}
        onBlur={changeOnBlur ? handleBlur : undefined}
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
}

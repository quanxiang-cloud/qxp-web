import React, {
  CSSProperties,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  ForwardedRef,
} from 'react';
import cs from 'classnames';
import { useSetState } from 'react-use';

import { getRect } from '../utils/hooks/use-rect';

import { InputInstance, InputProps } from './types';

const InputComponent = (props: InputProps, ref: ForwardedRef<InputInstance>): JSX.Element => {
  const nativeInputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(props.defaultValue ?? '');
  const [hasFocus, setHasFocus] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const [padding, setPadding] = useSetState<CSSProperties>({});

  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (beforeRef?.current) {
      const width = getRect(beforeRef.current).width;
      if (width > 0) {
        setPadding({ paddingLeft: width });
      }
    }
    if (afterRef?.current) {
      const width = getRect(afterRef.current).width;
      if (width > 0) {
        setPadding({ paddingRight: width });
      }
    }
  }, [beforeRef?.current, afterRef?.current]);

  function handleKeydown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (props.onEnterPress && (e.code === 'Enter' || e.keyCode === 13)) {
      props.onEnterPress(e);
    }
    props.onKeyDown?.(e);
  }

  useLayoutEffect(() => {
    if (!props.enterKeyHint) return;
    nativeInputRef.current?.setAttribute('enterkeyhint', props.enterKeyHint);
    return () => {
      nativeInputRef.current?.removeAttribute('enterkeyhint');
    };
  }, [props.enterKeyHint]);

  useImperativeHandle(ref, () => ({
    focus: () => {
      nativeInputRef.current?.focus();
    },
    blur: () => {
      nativeInputRef.current?.blur();
    },
    value,
    setValue,
    error,
    validate: () => {
      const err = props.validate?.(value);
      setError(err);
      return err;
    },
  }));

  return (
    <>
      <div style={props.style}
        className={cs('input--wrapper', props.className, {
          'input--wrapper__focus': hasFocus,
          'input--wrapper__error': error,
          'input--wrapper__readonly': props.readOnly,
        })}>
        {!!props.renderBefore && (
          <div className='before--wrapper' ref={beforeRef}>
            {props.renderBefore}
          </div>
        )}
        <input
          ref={nativeInputRef}
          className={cs('input--input')}
          style={padding}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            props.onChange?.(e.target.value);
          }}
          onFocus={(e) => {
            setHasFocus(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setHasFocus(false);
            if (props.validate) {
              setError(props.validate(value));
            }
            props.onBlur?.(e);
          }}
          placeholder={props.placeholder}
          disabled={props.disabled}
          readOnly={props.readOnly}
          onKeyDown={handleKeydown}
          maxLength={props.maxLength}
          minLength={props.minLength}
          max={props.max}
          min={props.min}
          autoComplete={props.autoComplete}
          pattern={props.pattern}
          type={props.type}
          autoCapitalize={props.autoCapitalize}
          autoCorrect={props.autoCorrect}
        />
        {!!props.renderAfter && (
          <div className='after--wrapper' ref={afterRef}>
            {props.renderAfter}
          </div>
        )}
      </div>
      {!!error && !hasFocus && (
        <p className='caption text-red-600 mt-4'>
          {error}
        </p>
      )}
    </>
  );
};

export const Input = forwardRef<InputInstance, InputProps>(InputComponent);

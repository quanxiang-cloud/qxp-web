import React, { CSSProperties } from 'react';
import cs from 'classnames';

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  className?: string;
  label?: string | React.ReactElement;
  labelClassName?: string;
  labelStyle?: CSSProperties;
  indeterminate?: boolean;
}

function Checkbox(
  {
    className = '', label, indeterminate, onChange, labelClassName, labelStyle, ...inputProps
  }: Props,
  ref?: React.Ref<HTMLInputElement>
): JSX.Element {
  const defaultRef = React.useRef();
  const resolvedRef: any = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <label className={cs('checkbox flex items-center', className)}>
      <input
        {...inputProps}
        ref={resolvedRef}
        type="checkbox"
        onChange={onChange}
        className={classnames('checkbox__input', {
          'checkbox__input--indeterminate': indeterminate,
        })}
      />
      {label && (
        <span
          className={cs('checkbox__label text-caption ml-8', labelClassName)}
          style={labelStyle}
        >
          {label}
        </span>
      )}
    </label>
  );
}

export default React.forwardRef<HTMLInputElement, Props>(Checkbox);

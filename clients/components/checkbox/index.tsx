import React from 'react';
import cs from 'classnames';

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label?: string | React.ReactElement;
  indeterminate?: boolean;
}

function Checkbox(
  { className, label, indeterminate, ...inputProps }: Props,
  ref?: React.Ref<HTMLInputElement>,
): JSX.Element {
  const defaultRef = React.useRef();
  const resolvedRef: any = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  const { style = {}, disabled } = inputProps;

  return (
    <label className={cs('checkbox flex items-center', className)}>
      <input
        {...inputProps}
        style={{ ...style, cursor: disabled ? 'not-allowed' : 'pointer' }}
        ref={resolvedRef}
        type="checkbox"
        className={cs('checkbox__input', {
          'checkbox__input--indeterminate': indeterminate,
        })}
      />
      {label && (
        <span className="checkbox__label text-caption ml-8">
          {label}
        </span>
      )}
    </label>
  );
}

export default React.forwardRef<HTMLInputElement, Props>(Checkbox);

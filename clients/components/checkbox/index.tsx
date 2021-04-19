import React from 'react';
import classnames from 'classnames';

import { GroupContext, CheckboxValueType } from './checkbox-group';

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  className?: string;
  label?: string | React.ReactElement;
  indeterminate?: boolean;
}

function Checkbox(
  { className = '', label, indeterminate, ...inputProps }: Props,
  ref?: React.Ref<HTMLInputElement>
): JSX.Element {
  const defaultRef = React.useRef();
  const resolvedRef: any = ref || defaultRef;
  const checkboxGroup = React.useContext(GroupContext);

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  const checkboxProps = { ...inputProps };

  if (checkboxGroup) {
    checkboxProps.onChange = (args) => {
      if (inputProps.onChange) {
        inputProps.onChange(args);
      }
      if (checkboxGroup.toggleOption) {
        checkboxGroup.toggleOption({ label, value: inputProps.value as CheckboxValueType });
      }
    };
    checkboxProps.checked = checkboxGroup.value &&
    (checkboxGroup.value.indexOf(inputProps.value as CheckboxValueType) !== -1);
    checkboxProps.disabled = inputProps.disabled || checkboxGroup.disabled;
  }

  return (
    <label className={classnames('checkbox flex items-center', className)}>
      <input
        {...checkboxProps}
        ref={resolvedRef}
        type="checkbox"
        readOnly={!checkboxProps.onChange}
        className={classnames('checkbox__input', {
          'checkbox__input--indeterminate': indeterminate,
        })}
      />
      {label ? (<span className="checkbox__label text-caption ml-8">{label}</span>) : null}
    </label>
  );
}

export default React.forwardRef<HTMLInputElement, Props>(Checkbox);

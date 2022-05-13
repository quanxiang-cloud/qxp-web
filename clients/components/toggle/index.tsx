import React, { useState, useEffect } from 'react';
import cs from 'classnames';

import './index.scss';

type Props = {
  onChange: (value: boolean) => void
  onText?: string
  offText?: string
  disabled?: boolean
  defaultChecked?: boolean
  checked?: boolean
  className?: string
  style?: React.CSSProperties
}

function Toggle({
  onChange,
  onText,
  offText,
  disabled = false,
  defaultChecked = false,
  checked: isChecked,
  className,
  style,
}: Props): JSX.Element {
  const [checked, setChecked] = useState(isChecked || defaultChecked);

  const handleToggleSwitch = (): void => {
    if (disabled) {
      return;
    }
    if (!(isChecked === undefined)) {
      setChecked(isChecked);
      onChange && onChange(!isChecked);
      return;
    }

    setChecked(!checked);
    onChange && onChange(!checked);
  };

  useEffect(() => {
    !(isChecked === undefined) && setChecked(isChecked);
  }, [isChecked]);

  return (
    <label
      className={cs('qxp-toggle', className, { disabled, checked })}
      style={style}
      onClick={handleToggleSwitch}
    >
      {onText && offText && (
        <span
          className={cs('text', { checked })}
        >
          {checked ? onText : offText}
        </span>
      )}
    </label>
  );
}

export default Toggle;

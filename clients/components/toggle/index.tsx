import React, { useState } from 'react';
import classNames from 'classnames';

import './index.scss';

type Props = {
  onChange: (value?: boolean) => void
  onText?: string
  offText?: string
  disabled?: boolean
  defaultChecked?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function Toggle({
  onChange,
  onText,
  offText,
  disabled = false,
  defaultChecked = false,
  className,
  style,
}: Props) {
  const [checked, setChecked] = useState(defaultChecked);

  const handleToggleSwitch = () => {
    if (disabled) {
      return;
    }
    setChecked(((prevChecked) => {
      onChange(!prevChecked);
      return !prevChecked;
    }));
  };

  return (
    <div>
      <label
        className={classNames('qxp-toggle', className, { disabled, checked })}
        style={style}
        onClick={handleToggleSwitch}
      >
        {onText && offText && (
          <span
            className={classNames('text', { checked })}
          >
            {checked ? onText : offText}
          </span>
        )}
      </label>
    </div>

  );
}

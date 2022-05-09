import React, { Children, isValidElement, useState, ReactElement, useEffect } from 'react';

import { RadioValueType } from './index';

interface Props {
  children: (boolean | ReactElement)[];
  value?: RadioValueType
  onChange?: (value: RadioValueType) => void;
}

function RadioGroup({ children, value, onChange }: Props): JSX.Element {
  const [checkedValue, setCheckedValue] = useState<RadioValueType>(value || '');

  useEffect(() => {
    if (value === undefined) return;
    setCheckedValue(value);
  }, [value]);

  return (
    <>
      {
        Children.map(children, (child) => {
          if (isValidElement(child) && child.props.value !== null) {
            return React.cloneElement(child as ReactElement, {
              onChange: (value: RadioValueType) => {
                setCheckedValue(value);
                onChange?.(value);
              },
              checked: checkedValue === child.props.value,
            });
          }
          return child;
        })
      }
    </>
  );
}

export default RadioGroup;

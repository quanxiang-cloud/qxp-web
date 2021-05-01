import React, { Children, isValidElement, useState, ReactElement, memo } from 'react';

interface Props {
  children: (boolean | ReactElement)[];
  onChange: (value: string | number | boolean) => void;
}

function RadioGroup({ children, onChange }: Props) {
  const [checkedIndex, setCheckedIndex] = useState(-1);

  return (
    <>
      {
        Children.map(children, (child, index) => {
          if (isValidElement(child) && child.props.value != null) {
            return React.cloneElement(child as ReactElement, {
              onChange: (value: string | number | boolean) => {
                setCheckedIndex(index);
                onChange(value);
              },
              checked: checkedIndex === index,
            });
          }
          return child;
        })
      }
    </>
  );
}

export default memo(RadioGroup) as typeof RadioGroup;

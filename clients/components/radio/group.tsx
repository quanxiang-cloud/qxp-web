import React, { Children, isValidElement, useState, ReactElement } from 'react';

interface Props {
  children: ReactElement[];
  onChange: (value: string | number | boolean) => void;
}

export default function RadioGroup({ children, onChange }: Props) {
  const [checkedIndex, setCheckedIndex] = useState(-1);

  return (
    <>
      {
        Children.map(children, (child, index) => {
          if (isValidElement(child)) {
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

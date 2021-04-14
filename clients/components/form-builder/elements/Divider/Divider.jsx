import React from 'react';
import { Divider as AntDivider } from 'antd';

const Divider = ({ text, className, dashed, orientation, plain }) => {
  return (
    <AntDivider
      className={className}
      dashed={dashed}
      orientation={orientation}
      plain={!plain}
      type="horizontal"
    >
      {text}
    </AntDivider>
  );
};

// Divider.isVirtualFieldComponent = true;

export default Divider;

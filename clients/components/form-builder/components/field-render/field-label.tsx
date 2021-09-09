import React from 'react';

import { Col } from 'antd';

export type LabelProps = {
  isLayoutComponent: boolean;
  required: boolean;
  title: string;
  labelAlign: string;
};

const LAYOUT_COL_SPAN = 4;

function FieldLabel({
  isLayoutComponent = false,
  required = false,
  title,
  labelAlign = 'left',
}: LabelProps): JSX.Element {
  return (
    <>
      {!isLayoutComponent &&
        (<Col span={labelAlign === 'top' ? '' : LAYOUT_COL_SPAN}>
          <label className={`field-label ${required ? 'field-require' : ''}`}>{title || '--'}</label>
        </Col>)}
    </>
  );
}
export default FieldLabel;


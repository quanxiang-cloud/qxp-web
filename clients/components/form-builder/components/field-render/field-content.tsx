import React, { JSXElementConstructor } from 'react';

import { Row, Col } from '@c/form-builder/components/grid';
import { LAYOUT_COL_SPAN } from './constant';

export type ContentProps = {
  readOnly: boolean;
  isLayoutComponent: boolean;
  field: ISchema;
  description: string;
  Comp: JSXElementConstructor<any>;
  isTopAlign?: boolean;
};

function FieldContent({
  isLayoutComponent = false,
  readOnly = false,
  field,
  description,
  isTopAlign,
  Comp,
}: ContentProps): JSX.Element {
  let layout_col_span = 24;
  if (!isTopAlign) {
    layout_col_span = isLayoutComponent ? 24 : 24 - LAYOUT_COL_SPAN;
  }

  return (
    <>
      {readOnly ? <>N/A</> :
        (<Col span={layout_col_span}>
          <Row><Comp props={{ ...field }} /></Row>
          {description && <Row><span className='description'>{description}</span></Row>}
        </Col>)}
    </>
  );
}

export default FieldContent;


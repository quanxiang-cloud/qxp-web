import React from 'react';
import { Row } from 'antd';

import FieldContent, { ContentProps } from './field-content';
import FieldLabel, { LabelProps } from './field-label';

type FieldFragmentProps = {
  isTopAlign: boolean;
  labelProps: LabelProps;
  contentProps: ContentProps;
}

const FieldFragment = (props: FieldFragmentProps): JSX.Element => {
  const { labelProps, contentProps, isTopAlign } = props;
  if (isTopAlign) {
    return (
      <>
        <Row><FieldLabel {...labelProps} /></Row>
        <Row><FieldContent {...contentProps} /></Row>
      </>
    );
  }

  return (
    <Row>
      <FieldLabel {...labelProps} />
      <FieldContent {...contentProps} />
    </Row>
  );
};

export default FieldFragment;


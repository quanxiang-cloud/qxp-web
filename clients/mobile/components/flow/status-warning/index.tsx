import React from 'react';
import cs from 'classnames';

import { Props } from '@m/qxp-ui-mobile';
import Icon from '@m/qxp-ui-mobile/icon';

import './index.scss';

export interface StatusWarningProps extends Props {
  text: string;
}

export default function StatusWarning(props: StatusWarningProps): JSX.Element {
  return (
    <div className={cs('flow-status-warning-wrapper flex justify-center items-center', props.className)}>
      <Icon name='info' size='.18rem' />
      <div className='warning-text body2'>{props.text}</div>
    </div>
  );
}

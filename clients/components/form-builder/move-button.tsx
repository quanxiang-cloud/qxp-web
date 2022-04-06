import React from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';

import './index.scss';

function MoveButton({ fieldId }: { fieldId: string }): JSX.Element {
  return (
    <div
      className='field-icon move-field-icon'
    >
      <Icon name="drag" size={16} />
    </div >
  );
}

export default observer(MoveButton);

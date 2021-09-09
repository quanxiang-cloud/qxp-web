import React from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import { StoreContext } from '@c/form-builder/context';

import './index.scss';

type Props = {
  fieldId: string;
}

function MoveButton({ fieldId }: Props): JSX.Element {
  const store = React.useContext(StoreContext);

  return (
    <div
      className='field-icon move-field-icon'
      onClick={() => store.clone(fieldId)}>
      <Icon type="light" name="move" size={16} />
    </div >
  );
}

export default observer(MoveButton);

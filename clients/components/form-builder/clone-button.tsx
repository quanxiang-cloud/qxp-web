import React from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import { StoreContext } from '@c/form-builder/context';

import './index.scss';

type Props = {
  fieldId: string;
}

function CloneButton({ fieldId }: Props): JSX.Element {
  const store = React.useContext(StoreContext);

  return (
    <div
      className='field-icon copy-field-icon'
      onClick={() => store.clone(fieldId)}>
      <Icon type="light" name="content_copy" size={16} />
    </div >
  );
}

export default observer(CloneButton);

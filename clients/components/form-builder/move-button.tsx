import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { StoreContext } from '@c/form-builder/context';
import Icon from '@c/icon';

import './index.scss';
type ReactMouseEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

function MoveButton({ fieldId }: { fieldId: string }): JSX.Element {
  const store = useContext(StoreContext);

  const setActive = (e: ReactMouseEvent, fieldId: string): void => {
    e.stopPropagation();
    e.preventDefault();
    store.setActiveFieldKey(fieldId);
  };

  return (
    <div
      className='field-icon move-field-icon'
      onMouseEnter={(e) => setActive(e, fieldId)}
    >
      <Icon name="drag" size={16} />
    </div >
  );
}

export default observer(MoveButton);

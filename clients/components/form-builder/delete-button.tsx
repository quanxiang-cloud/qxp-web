import React from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import { StoreContext } from '@c/form-builder/context';

type Props = {
  filedName: string;
}

function DeleteButton({ filedName }: Props): JSX.Element {
  const store = React.useContext(StoreContext);

  const handleClick = (): void => {
    if (!store.activeField) {
      return;
    }

    store.deleteField(filedName);
  };

  return (
    <div
      onClick={handleClick}
      className="delete-field-icon"
    >
      <Icon type="light" name="delete_outline" size={16} />
    </div>
  );
}

export default observer(DeleteButton);

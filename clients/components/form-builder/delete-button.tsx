import React from 'react';

import { StoreContext } from '@c/form-builder/context';
import Icon from '@c/icon';

type Props = {
  filedName: string;
}

function DeleteButton({ filedName }: Props): JSX.Element {
  const store = React.useContext(StoreContext);

  return (
    <div
      className="delete-field-icon"
      onClick={() => store.deleteField(filedName)}
    >
      <Icon type="light" name="delete_outline" size={16} />
    </div>
  );
}

export default DeleteButton;

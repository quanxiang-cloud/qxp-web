import React from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import { StoreContext } from '@c/form-builder/context';

type Props = {
  filedName: string;
}

function DeleteButton({ filedName }: Props): JSX.Element {
  const store = React.useContext(StoreContext);

  return (
    <div
      onClick={() => store.deleteField(filedName)}
      className="delete-field-icon"
    >
      <Icon type="light" name="delete_outline" size={16} />
    </div>
  );
}

export default observer(DeleteButton);

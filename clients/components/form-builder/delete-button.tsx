import React from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import { StoreContext } from '@c/form-builder/context';

type Props = {
  filedId: string;
}

function DeleteButton({ filedId }: Props): JSX.Element {
  const store = React.useContext(StoreContext);

  return (
    <div
      onClick={() => store.deleteField(filedId)}
      className="field-icon delete-field-icon"
    >
      <Icon type="light" name="delete_outline" size={16} />
    </div>
  );
}

export default observer(DeleteButton);

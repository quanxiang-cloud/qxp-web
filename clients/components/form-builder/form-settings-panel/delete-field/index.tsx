import React from 'react';
import { observer } from 'mobx-react';
import { ReactSortable, Sortable } from 'react-sortablejs';

import { StoreContext } from '@c/form-builder/context';
import Icon from '@c/icon';

const GroupOptions: Sortable.GroupOptions = {
  name: 'form_builder',
  put: true,
};

function DeleteField(): JSX.Element {
  const store = React.useContext(StoreContext);

  const handleAddField = (e: Sortable.SortableEvent): void => {
    const filedName = e.clone.getAttribute('data-id');

    if (filedName === null) return;

    store.deleteField(filedName);
  };

  return (
    <div className="delete-warp-reletive">
      <ReactSortable
        onAdd={handleAddField}
        className="delete_warp"
        list={[{ id: 'delete_icon' }]}
        setList={() => { }}
        group={GroupOptions}
      />
      <Icon className="delete-icon" name="delete_outline" size={88} />
    </div>
  );
}

export default observer(DeleteField);

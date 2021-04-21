import React, { useContext } from 'react';
import classnames from 'classnames';

import { FieldConfigContext } from '../form-settings-panel/form-field-config-context';
import Icon from '@c/icon';
import Button from '@c/button';

export function deleteOperate(idx: number) {
  const { actions } = useContext(FieldConfigContext);

  const mutator = actions.createMutators('availableOptions');

  return (
    <>
      <div className="delete-container">
        <Icon
          className={classnames('operate-icon', 'delete-icon')}
          name="delete"
          size={24}
          onClick={() => {
            mutator.remove(idx);
          }}
        />
      </div>
    </>
  );
}

export function extraOperations(idx: number) {
  const { actions } = useContext(FieldConfigContext);

  const mutator = actions.createMutators('availableOptions');

  return (
    <>
      <div className="ml-24">
        <Icon
          className="operate-icon"
          name="keyboard_arrow_up"
          onClick={() => {
            mutator.moveUp(idx);
          }}
        />
        <Icon
          className="operate-icon"
          name="keyboard_arrow_down"
          onClick={() => {
            mutator.moveDown(idx);
          }}
        />
      </div>
    </>
  );
}

export function addOperate() {
  return <Button>添加选项</Button>;
}

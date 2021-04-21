import React, { useContext } from 'react';

import { FieldConfigContext } from '../form-settings-panel/form-field-config-context';
import Icon from '@c/icon';
import Button from '@c/button';

export function deleteOperate(idx: number) {
  const { actions } = useContext(FieldConfigContext);

  const mutator = actions.createMutators('availableOptions');

  return (
    <>
      <div style={{ position: 'relative', height: '32px' }}>
        <Icon
          className="operate-icon"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
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
      <div className="ml-28">
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

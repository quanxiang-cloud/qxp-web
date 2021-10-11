import React, { useContext } from 'react';
import { Input } from 'antd';
import classnames from 'classnames';

import Icon from '@c/icon';
import Button from '@c/button';

import { FieldConfigContext } from '../form-settings-panel/form-field-config/context';

const TextArea = Input.TextArea;

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
          onClick={() => mutator.remove(idx)}
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
          onClick={() => mutator.moveUp(idx)}
        />
        <Icon
          className="operate-icon"
          name="keyboard_arrow_down"
          onClick={() => mutator.moveDown(idx)}
        />
      </div>
    </>
  );
}

export function AddOperate() {
  const { actions } = useContext(FieldConfigContext);
  const mutator = actions.createMutators('availableOptions');
  const options = actions.getFieldValue('availableOptions');

  return (
    <>
      <Button
        className="mr-8"
        onClick={() => {
          let hasNullOption = false;
          options.forEach((element: any) => {
            if (element.label === '' || element.label === undefined) {
              hasNullOption = true;
              return;
            }
          });

          if (hasNullOption === false) {
            mutator.push({ label: '', value: '' });
          }
        }}
      >
        添加选项
      </Button>
    </>
  );
}

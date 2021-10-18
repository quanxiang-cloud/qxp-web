import React, { useState } from 'react';
import classnames from 'classnames';
import { useFormEffects, IMutators, IFormActions } from '@formily/antd';

import Icon from '@c/icon';
import Button from '@c/button';

export function deleteOperate(idx: number): JSX.Element {
  const [mutators, setMutators] = useState<IMutators>();

  useFormEffects((selector) => {
    if (mutators) {
      return;
    }
    const mutator = selector.createMutators('availableOptions');
    setMutators(mutator);
  });

  return (
    <>
      <div className="delete-container">
        <Icon
          className={classnames('operate-icon', 'delete-icon')}
          name="delete"
          size={24}
          onClick={() => mutators?.remove(idx)}
        />
      </div>
    </>
  );
}

export function extraOperations(idx: number): JSX.Element {
  const [mutators, setMutators] = useState<IMutators>();

  useFormEffects((selector) => {
    if (mutators) {
      return;
    }
    const mutator = selector.createMutators('availableOptions');
    setMutators(mutator);
  });

  return (
    <>
      <div className="ml-24">
        <Icon
          className="operate-icon"
          name="keyboard_arrow_up"
          onClick={() => mutators?.moveUp(idx)}
        />
        <Icon
          className="operate-icon"
          name="keyboard_arrow_down"
          onClick={() => mutators?.moveDown(idx)}
        />
      </div>
    </>
  );
}

export function AddOperate(): JSX.Element {
  const [actions, setActions] = useState<IFormActions>();

  useFormEffects((_, _actions) => {
    if (actions) {
      return;
    }
    setActions(_actions);
  });

  const mutator = actions?.createMutators('availableOptions');
  const options = actions?.getFieldValue('availableOptions');

  return (
    <>
      <Button
        className="mr-8"
        onClick={() => {
          mutator?.change(options.concat([{ label: `选项${options.length + 1}`, isDefault: false }]));
        }}
      >
        添加选项
      </Button>
    </>
  );
}

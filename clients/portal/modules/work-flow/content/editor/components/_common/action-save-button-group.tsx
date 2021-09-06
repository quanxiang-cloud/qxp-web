import React, { MouseEventHandler } from 'react';
import cs from 'classnames';

import Button from '@c/button';
import useObservable from '@lib/hooks/use-observable';
import store from '@flow/content/editor/store';
import { StoreValue } from '@flow/content/editor/type';

interface Props {
  onCancel: () => void;
  onSave: MouseEventHandler;
}

export default function({ onCancel, onSave }: Props): JSX.Element | null {
  const { status } = useObservable<StoreValue>(store);

  if (status === 'ENABLE') {
    return null;
  }

  return (
    <div className={cs(
      'flex justify-end flex-none z-10 bg-gray-100 absolute left-0',
      'right-0 bottom-0 h-64 px-20 items-center',
    )}>
      <Button
        className="mr-20"
        iconName="close"
        type="button"
        onClick={onCancel}
      >
        取消
      </Button>
      <Button
        modifier="primary"
        iconName="save"
        type="submit"
        onClick={onSave}
      >
        保存
      </Button>
    </div>
  );
}

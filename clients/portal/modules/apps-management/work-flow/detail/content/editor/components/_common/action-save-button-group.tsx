import React from 'react';
import cs from 'classnames';

import Button from '@c/button';

interface Props {
  onCancel: () => void;
}

export default function({ onCancel }: Props) {
  return (
    <div className={cs(
      'flex justify-end flex-none z-10 bg-gray-100 absolute left-0',
      'right-0 bottom-0 h-64 px-20 items-center'
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
      >
        保存
      </Button>
    </div>
  );
}

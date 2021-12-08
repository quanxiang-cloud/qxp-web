import React from 'react';

import Tooltip from '@c/tooltip';
import Icon from '@c/icon';

interface Props {
  value?: string;
  onChange?: (bol: boolean) => void;
}

function Checkbox({ value, onChange }: Props): JSX.Element {
  function handleChange(e: any): void {
    onChange && onChange(e.target.checked);
  }

  return (
    <div className="flex items-center">
      <label className="flex items-center">
        <input
          type="checkbox"
          value={value || ''}
          className="mr-8"
          onChange={handleChange}
        />
        <span>扩展为多层选项集</span>
      </label>
      <Tooltip
        label="扩展后，可以自由添加子级选项数据"
        position="top"
        className="whitespace-nowrap"
      >
        <Icon name='info' className='text-gray-400 ml-8' />
      </Tooltip>
    </div>
  );
}

export default Checkbox;

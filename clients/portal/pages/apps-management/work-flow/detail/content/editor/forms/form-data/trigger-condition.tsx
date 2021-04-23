import React, { useState, useCallback } from 'react';
import classnames from 'classnames';

import Toggle from '@c/toggle';
import Icon from '@c/icon';

export default function() {
  const options = [{
    label: '修改时间',
    value: '1',
  }, {
    label: '创建时间',
    value: '2',
  }, {
    label: '创建人',
    value: '3',
  }, {
    label: '申请时间',
    value: '4',
  }];
  const [openMore, setOpenMore] = useState(false);

  const onChange = useCallback((v) => setOpenMore(!!v), []);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-body2">触发条件</div>
          <span className="text-caption">设置触发筛选条件，满足条件后触发工作流</span>
        </div>
        <Toggle onChange={onChange} />
      </div>
      <div className={classnames('overflow-hidden transition-all', {
        visible: openMore,
        invisible: !openMore,
        'h-0': !openMore,
        'h-auto': openMore,
        'opacity-0': !openMore,
        'opacity-1': openMore,
      })}>
        <div
          className={classnames(
            'flex items-center border border-dashed border-gray-300 small-border-radius',
            'py-5 text-button mt-16 justify-center cursor-pointer h-32',
          )}
        >
          <Icon name="add" className="mr-8" size={20} />
          <span>添加或条件</span>
        </div>
      </div>
    </>
  );
}

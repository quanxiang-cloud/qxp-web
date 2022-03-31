import React from 'react';

import Icon from '@c/icon';
import ToolTip from '@c/tooltip';

export default function toDocs(): JSX.Element {
  return (
    <ToolTip position='bottom' label='点击前往查看文档'>
      <a
        href={`//${window.CONFIG.docs_hostname}`}
        target="_blank"
        rel="noreferrer"
        className="cursor-pointer corner-4-0-4-4 text-white hover:bg-gray-100 hover:text-gray-600"
      >
        <Icon name='help_doc' size={20} style={{ fill: 'var(--gray-400)' }} className='text-current m-6'/>
      </a>
    </ToolTip>
  );
}

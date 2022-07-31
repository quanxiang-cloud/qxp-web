import React from 'react';

import { Icon } from '@one-for-all/ui';
import ToolTip from '@c/tooltip';
import InsideDocsPortal from '@c/qxp-docs-inside-portal';

export default function toDocs(): JSX.Element {
  return (
    <ToolTip position='bottom' label='点击前往查看文档'>
      <a
        className="cursor-pointer corner-4-0-4-4 text-white hover:bg-gray-100 hover:text-gray-600"
        onClick={() => InsideDocsPortal.show({ targetUrl: `https://${window.CONFIG.docs_hostname}` })}
      >
        <Icon name="help_doc" size={20} style={{ fill: 'var(--gray-400)' }} className='text-current m-6'/>
      </a>
    </ToolTip>
  );
}

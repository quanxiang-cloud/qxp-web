import React, { useState } from 'react';
import { FlowType, ApprovalFilter } from '@m/pages/approvals/types';
import Icon from '@m/qxp-ui-mobile/icon';
import cs from 'classnames';
import AlertDialog from '@m/components/alert-dialog';
import './filter.scss';

export interface FilterProps {
  type: FlowType;
  filterKey?: string;
  filter?: ApprovalFilter;
  onClickCCReadAll?: () => Promise<boolean>;
  onFilterClick?: () => void;
  show: boolean;
}

export function Filter({
  type, filterKey, onClickCCReadAll, onFilterClick, filter, show,
}: FilterProps): JSX.Element | null {
  if (!filterKey) return null;

  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <div className='task-filter-wrapper body1'>
        <div className='task-filter flex items-center justify-center' onClick={onFilterClick}>
          <div className='text-placeholder'>{type === 'WAIT_HANDLE_PAGE' ? '处理类型' : '状态'}：</div>
          <div className={`flex-1 ${show ? 'text-highlight' : 'text-primary'}`}>
            {filter?.label}
          </div>
          <Icon name='keyboard_arrow_down' size='.2rem'/>
        </div>

        {type === 'CC_PAGE' && (
          <div
            className={cs(
              'flex items-center justify-center read-all',
              { pointer: onClickCCReadAll },
              onClickCCReadAll ? 'text-highlight' : 'disabled',
            )}
            onClick={onClickCCReadAll ? () => setShowPopup(true) : undefined}
          >
            <Icon name='done_all' size='.17rem'/>
            <div className='ml-4'>全部已读</div>
          </div>
        )}
      </div>

      <AlertDialog
        title='确定全部标记为已读吗?'
        show={showPopup}
        onPositiveClick={onClickCCReadAll}
        positiveButton={{ text: '确定标记', loadingText: '标记中' }}
        negativeButton
        onClose={() => setShowPopup(false)} />
    </>

  );
}

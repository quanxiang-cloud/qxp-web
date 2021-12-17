import React, { useState } from 'react';
import Divider from '@m/qxp-ui-mobile/divider';
import Icon from '@m/qxp-ui-mobile/icon';
import AlertDialog from '@m/components/alert-dialog';

export interface FilterProps {
  unread: number;
  onClickReadAll?: () => Promise<boolean>;
}

const readAllStyle = {
  padding: '.1rem',
  marginLeft: '.04rem',
  marginRight: '-0.12rem',
  borderRadius: '.08rem',
};

export default function Filter({ unread, onClickReadAll }: FilterProps): JSX.Element | null {
  if (unread < 1) return null;

  const [showPopup, setShowPopup] = useState(false);
  return (
    <>
      <div className='flex justify-center' style={{ padding: '.12rem .16rem' }}>
        <div className='title-3 flex-1 truncate'>
          <span className='text-secondary'>未读消息 </span>
          <span className='text-placeholder'>({unread})</span>
        </div>
        <div
          className='flex items-center justify-center text-highlight'
          style={readAllStyle}
          onClick={() => setShowPopup(true)}
        >
          <Icon name='done_all' size='.17rem'/>
          <div className='ml-4'>全部已读</div>
        </div>
      </div>
      <Divider color='var(--gray-200)'/>

      <AlertDialog
        title='确定全部标记为已读吗?'
        show={showPopup}
        onPositiveClick={onClickReadAll}
        positiveButton={{ text: '确定标记', loadingText: '标记中' }}
        negativeButton
        onClose={() => setShowPopup(false)} />
    </>
  );
}

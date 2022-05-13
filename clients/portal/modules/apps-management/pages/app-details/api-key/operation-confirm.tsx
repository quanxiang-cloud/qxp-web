import Icon from '@c/icon';
import React from 'react';

interface Props {
  message: string,
  tips: string,
}

function OperationConfirm({ message, tips }: Props): JSX.Element {
  return (
    <div className='px-40 py-24'>
      <div className='flex items-center mb-8 text-yellow-600'>
        <Icon name='info' type='primary' size={18}/>
        <span className='ml-10 text-14'>
          {`确认要${message}吗？`}
        </span>
      </div>
      <div className='pl-28'>
        {tips}
      </div>
    </div>
  );
}

export default OperationConfirm;

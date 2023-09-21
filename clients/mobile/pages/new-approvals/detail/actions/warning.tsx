import Icon from '@m/qxp-ui-mobile/icon';
import React from 'react';

type Props = {
    text: string;
}

export default function Warning({ text }: Props): JSX.Element {
  return (
    <div className='flex items-center p-12 bg-yellow-50 text-yellow-600 rounded-tl-12 rounded-br-12
    mb-16'>
      <Icon name='info' size='0.3rem' className='mr-10' />
      <div className='text-14'>{text}</div>
    </div>
  );
}

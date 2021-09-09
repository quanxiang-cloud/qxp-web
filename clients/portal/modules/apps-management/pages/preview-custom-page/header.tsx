import React from 'react';
import { useHistory } from 'react-router-dom';

import Icon from '@c/icon';

import './index.scss';

type Props ={
  pageName: string;
}

function PreviewHeader({ pageName }: Props): JSX.Element {
  const history = useHistory();

  const goBack = (): void => {
    history.goBack();
  };

  return (
    <div className='bg-white h-56 mt-4'>
      <div className='flex items-center select-none py-18 px-20 text-gray-600 header-text'>
        <Icon
          clickable
          changeable
          size={20}
          onClick={goBack}
          className='go-back'
          name='keyboard_backspace'
        />
        <span className="ml-4">返回</span>
        <span className="mx-8">/</span>
        <span className="text-h6-bold text-gray-900 ml-4"> 预览自定义页面：{pageName}</span>
      </div>
    </div>
  );
}

export default PreviewHeader;

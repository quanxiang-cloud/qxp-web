import React from 'react';
import { useHistory } from 'react-router-dom';
import cs from 'classnames';

import Button from '@c/button';

import './index.scss';

export default function NotFound_Error({
  url = '/',
  classnames = 'main-content-without-header' }: {url?: string, classnames?: string}): JSX.Element {
  const history = useHistory();
  return (
    <div className={cs('notfound-body', classnames)}>
      <div className="notfound-left">
        <div className="notfound-image"></div>
        <div className="mt-40 mb-16">
          <p className="text-20 font-semibold ">抱歉，您访问的页面找不到了 😂 😂 😂</p>
          <p className="text-16 text-gray-600">可能是因为网络异常或者该页面已被移除。</p>
          <p>您可以选择：</p>
        </div>
        <Button
          onClick={() => history.push(url)}
          modifier='primary'
          iconName="keyboard_backspace"
        >
          返回上一页
        </Button>
      </div>
      <div className="notfound-right"></div>
    </div>
  );
}

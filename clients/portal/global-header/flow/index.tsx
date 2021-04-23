import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import Icon from '@c/icon';
import Button from '@c/button';
import { last } from '@lib/utils';

import NavButton from '../nav-button';

export default function GlobalHeader() {
  const { pathname } = useLocation();
  const paramsMap = {
    'form-data': '工作表触发',
    'form-time': '工作表时间触发',
  };
  const type = last(pathname.split('/')) as 'form-data' | 'form-time';
  const history = useHistory();

  return (
    <header className="flex justify-between items-center py-18 px-24 bg-white shadow-flow-header">
      <section className="flex flex-row items-center">
        <Icon
          name="arrow-go-back"
          size={22}
          className="mr-22 cursor-pointer"
          onClick={() => history.goBack()}
        />
        <span
          className="mr-8 text-caption-no-color text-amber-600 px-6 bg-amber-50
          rounded-tl-6 rounded-br-6"
        >
          {paramsMap[type]}
        </span>
        <div className="flex items-center">
          <span className="mr-8 text-h6 font-semibold">未命名工作流</span>
          <Icon name="edit" size={16} />
        </div>
      </section>
      <section className="flex flex-row items-center">
        <div className="mr-32 pr-24 flex items-center border-r-1 border-gray-200">
          <span className="text-body2-no-color text-gray-400 mr-18">当前状态:</span>
          <span
            className="text-body2-no-color text-gray-600 bg-gray-100 px-8 py-1
            rounded-tl-6 rounded-br-6 mr-24">
              草稿
          </span>
          <Button
            modifier="primary"
            iconName="toggle_on"
            className="py-5"
          >
            发布
          </Button>
        </div>
        <NavButton
          className="mr-0"
          iconName="book"
          text="帮助文档"
        />
      </section>
    </header>
  );
}

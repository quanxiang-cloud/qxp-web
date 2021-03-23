import React from 'react';

import { More } from '@portal/components/more';

import { Icon } from '@QCFE/lego-ui';
import { uuid } from '@assets/lib/utils';

export const PersonalSettingMenu = () => {
  return (
    <More
      items={[
        <div
          key={uuid()}
          className="cursor-pointer flex items-center h-3-dot-6 px-1-dot-6
          hover:blue-100 transition justify-center"
        >
          个人中心
        </div>,
        <form key={uuid()} action="/logout" method="post" className="w-full h-full">
          <button
            type="submit"
            className="cursor-pointer flex items-center h-3-dot-6 px-1-dot-6
            hover:blue-100 transition w-full justify-center"
          >
            登出
          </button>
        </form>,
      ]}
      className="flex items-center justify-center"
      contentClassName="w-48"
    >
      <div
        className="cursor-pointer flex items-center h-3-dot-6 px-1-dot-6
        hover:blue-100 transition"
      >
        个人设置
        <Icon name="caret-down" style={{ marginLeft: '8px' }} />
      </div>
    </More>
  );
};

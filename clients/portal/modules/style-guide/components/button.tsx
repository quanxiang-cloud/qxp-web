import React from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

import './index.css';

interface Props extends React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  modifier?: 'primary' | 'danger';
  loading?: boolean;
  forbidden?: boolean;
  iconName?: string;
}

function ButtonPreview(
  {
    iconName,
    modifier,
    forbidden,
    loading,
  }: Props,
): JSX.Element {
  return (
    <button
      className={cs('qxp-btn qxp-btn-custom', {
        [`qxp-btn--${modifier}`]: modifier,
        'qxp-btn--forbidden opacity-50': forbidden,
        'qxp-btn--loading': loading,
        'pointer-events-none': loading || forbidden,
      })}
      disabled={forbidden}
    >
      {iconName && (
        <Icon
          name='refresh'
          type={modifier === 'primary' ? 'light' : 'dark'}
          size={20}
          className={cs('fill-current text-inherit mr-4', {
            'animate-spin': loading,
            'pointer-events-none': loading || forbidden,
          })}
        />
      )}
      <span>Preview</span>
    </button>
  );
}

const config_schema = [
  {
    selector: '.qxp-btn-custom',
    desc: '可编辑属性有宽度、边框、圆角等',
    pseudo: [
      {
        selector: 'active',
        desc: '按钮点击效果',
      },
      {
        selector: 'hover',
        desc: '按钮鼠标移入效果',
      },
    ],
  },
];

export default {
  key: 'button',
  config_schema,
  Component: ButtonPreview,
};


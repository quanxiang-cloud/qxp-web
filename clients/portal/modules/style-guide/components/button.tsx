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
    title: '宽度',
    type: 'size',
    property: 'width',
    classnames: 'qxp-btn-custom',
  },
  {
    title: '边框',
    type: 'border',
    classnames: 'qxp-btn-custom',
  },
  {
    title: '圆角',
    type: 'border-radius',
    classnames: 'qxp-btn-custom',
  },
  {
    title: '背景色',
    type: 'color',
    property: 'background-color',
    classnames: 'qxp-btn-custom',
  },
  {
    title: '字体颜色',
    type: 'color',
    property: 'color',
    classnames: 'qxp-btn-custom',
  },
];

export default {
  key: 'button',
  config_schema,
  Component: ButtonPreview,
};


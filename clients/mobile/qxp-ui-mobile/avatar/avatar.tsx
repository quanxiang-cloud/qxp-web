import React from 'react';
import { AvatarInfo, AvatarProps } from './types';
import cs from 'classnames';
import { getSizeStyle } from '@m/qxp-ui-mobile/utils/format/unit';

const imgBgColors: string[] = [
  '#6366F1',
  '#F59E0B',
  '#10B981',
  '#F97316',
  '#A855F7',
  '#14B8A6',
  '#EF4444',
  '#06B6D4',
];

function getAvatarInfo(text: string, colors = imgBgColors): AvatarInfo {
  const reg = /^[a-zA-Z]*$/;
  let _text = (text || ' ').substr(0, 1);
  if (reg.test(_text)) {
    _text = _text.toUpperCase();
  }
  const num: number = _text.charCodeAt(0) % 8;
  return {
    name: _text,
    color: colors[num],
  };
}

const Avatar: React.FC<AvatarProps> = (props) => {
  const { name = '', size = '0.24rem', className = '', style } = props;
  const avatarInfo = getAvatarInfo(name);
  const _style = getSizeStyle(size, {
    ...(style || {}),
    backgroundColor: avatarInfo.color,
    lineHeight: size,
  });

  return (
    <div className={cs('avatar', { [className]: className })}
      style={_style}>
      {avatarInfo.name}
    </div>
  );
};

export default Avatar;

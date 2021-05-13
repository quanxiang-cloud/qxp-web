import React from 'react';

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

const getImgColor = (text: string, colors = imgBgColors) => {
  const reg = /^[a-zA-Z]*$/;
  let _text = text;
  if (reg.test(text)) {
    _text = text.toUpperCase();
  }
  const num: number = _text.charCodeAt(0) % 8;
  return {
    name: _text,
    color: colors[num],
  };
};

type AvatarSize = 24 | 48;

const AvatarStyle: Record<AvatarSize, { fontSize: number; cornerClassName: string}> = {
  24: {
    fontSize: 14,
    cornerClassName: 'corner-4-0-4-4',
  },
  48: {
    fontSize: 28,
    cornerClassName: 'corner-12-2-12-12',
  },
};

export interface Avatar {
  username?: string | undefined;
  size?: AvatarSize;
}

export default function Avatar({
  username = '',
  size = 24,
}: Avatar) {
  const avatarStyle = AvatarStyle[size];
  let head = '';
  let imgInfo: { name: string, color: string } = { name: '', color: '' };
  if (username) {
    head = username.substring(0, 1);
    imgInfo = getImgColor(head);
  }

  return (
    <div
      className={`${avatarStyle.cornerClassName} text-center text-white`}
      style={{
        width: size,
        height: size,
        lineHeight: `${size}px`,
        fontSize: avatarStyle.fontSize,
        backgroundColor: imgInfo.color,
      }}
    >
      {imgInfo.name}
    </div>
  );
}

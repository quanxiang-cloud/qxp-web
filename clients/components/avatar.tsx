import React from 'react';

import ItemWithTitleDesc from './item-with-title-desc';

// todo refactor
const imgBgColors: string[] = ['#6366F1', '#F59E0B', '#10B981', '#F97316',
  '#A855F7', '#14B8A6', '#EF4444', '#06B6D4'];
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

export interface Avatar {
  username?: string;
  bio?: string;
  size?: number | undefined;
  textSize?: number;
  cornerClassName?: string;
  title?: boolean;
  avatar?: string;
}

export default function Avatar({
  username = '',
  bio,
  title,
  size,
  cornerClassName,
  textSize,
}: Avatar) {
  let head = '';
  let imgInfo: { name: string, color: string } = { name: '', color: '' };
  if (username) {
    head = username.substring(0, 1);
    imgInfo = getImgColor(head);
  }

  return (
    <ItemWithTitleDesc
      itemRender={
        (
          <>
            {
              (head && imgInfo) && (
                <div className={`w-${size} h-${size} ${cornerClassName}
                  text-center text-white text-${textSize} leading-${size}`}
                style={{
                  backgroundColor: imgInfo.color,
                }}
                >
                  {imgInfo.name}
                </div>
              )
            }
          </>
        )
      }
      title={ title ? `${username}, 下午好!` : ''}
      desc={bio ? bio : ''}
      titleClassName="text-h4"
    />
  );
}

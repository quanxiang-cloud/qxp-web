import React, { useState, useEffect } from 'react';

import { ItemWithTitleDesc } from './item-with-title-desc4';
// import { loadImage } from '@assets/lib/utils';
import { getImgColor } from '../pages/access-control/company-maillist/excel';

export interface IAvatar {
  username?: string;
  bio: string;
  avatar?: string;
}

export const Avatar = ({ username = '', bio, avatar }: IAvatar) => {
  // const [imageURL, setImageURL] = useState<string | null>(null);

  // useEffect(() => {
  //   if (!avatar) {
  //     return;
  //   }
  //   loadImage(avatar).then(() => {
  //     setImageURL(avatar);
  //   }).catch(() => {
  //     setImageURL('/dist/images/avatar.jpg');
  //   });
  // }, [avatar]);

  let head = '';
  let bgColor = '';
  if (username) {
    head = username.substring(0, 1);
    bgColor = getImgColor(head);
  }

  return (
    <ItemWithTitleDesc
      itemRender={
        (
          <>
            {
              (head && bgColor) && (
                <div className="relative w-4-dot-8 h-4-dot-8 rounded-br-1 rounded-l-1
              text-center leading-4-dot-8 text-white text-2"
                style={{
                  backgroundColor: bgColor,
                }}
                >
                  {head}
                </div>
              )
            }
          </>
        )
      }
      title={`${username}, 下午好!`}
      desc={bio}
      titleClassName="text-2 text-black font-medium mb-2"
    />
  );
};

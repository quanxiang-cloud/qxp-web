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
                <div className="relative w-48 h-48 icon-border-radius
              text-center text-white text-24"
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
      titleClassName="text-20 text-black font-semibold text-12"
    />
  );
};

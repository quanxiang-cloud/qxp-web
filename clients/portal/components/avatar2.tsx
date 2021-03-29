import React, { useState, useEffect } from 'react';

import { ItemWithTitleDesc } from './item-with-title-desc';
// import { loadImage } from '@lib/utils';
import { getImgColor } from '@p/access-control/company-maillist/excel';

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
                <div className="relative w-48 h-48 icon-border-radius
              text-center text-white text-24 leading-48"
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
      title={`${username}, 下午好!`}
      desc={bio}
      titleClassName="text-h4"
    />
  );
};

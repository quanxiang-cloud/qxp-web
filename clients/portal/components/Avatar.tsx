import React, { useState, useEffect } from 'react';

import { ItemWithTitleDesc } from './Item-with-title-desc';
import { loadImage } from '@assets/lib/utils';

export interface IAvatar {
  username?: string;
  bio: string;
  avatar?: string;
}

export const Avatar = ({ username = '', bio, avatar }: IAvatar) => {
  const [imageURL, setImageURL] = useState<string | null>(null);

  useEffect(() => {
    if (!avatar) {
      return;
    }
    loadImage(avatar).then(() => {
      setImageURL(avatar);
    }).catch(() => {
      setImageURL('/dist/images/avatar.jpg');
    });
  }, [avatar]);

  return (
    <ItemWithTitleDesc
      itemRender={
        (
          <>
            {imageURL && (
              <img
                src={imageURL}
                alt={username}
                className="rounded-lg rounded-tr-none w-13 h-132"
              />
            )}
          </>
        )
      }
      title={`${username}, 下午好!`}
      desc={bio}
    />
  );
};

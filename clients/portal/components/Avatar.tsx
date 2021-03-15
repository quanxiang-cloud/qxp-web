import React from 'react';

import { ItemWithTitleDesc } from './ItemWithTitleDesc';

export interface IAvatar {
  username: string;
  bio: string;
  avatar: string;
}

export const Avatar = ({ username, bio, avatar }: IAvatar) => {
  return (
    <ItemWithTitleDesc
      itemRender={() => (
        <img src={avatar} alt={username} className="rounded-lg rounded-tr-none w-13 h-132" />
      )}
      title={`${username}, 下午好!`}
      desc={bio}
    />
  );
};

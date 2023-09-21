import React from 'react';

import Avatar from '@c/avatar';

interface Props {
  name?: string;
  link?: string;
}

function AvatarComp({ name, link }: Props): JSX.Element {
  if (link) {
    return (
      <div className="inline-flex justify-center items-center rounded-4 rounded-tr-none w-24 h-24">
        <img src={link} alt="" className="w-full h-full" />
      </div>
    );
  }

  return (
    <Avatar
      username={name}
    />
  );
}

export default AvatarComp;

import React from 'react';

import ItemWithTitleDesc from './item-with-title-desc';
import { getImgColor } from '@portal/pages/access-control/departments-employees/utils';

export interface Avatar {
  username?: string;
  bio: string;
  avatar?: string;
}

export default function Avatar({ username = '', bio }: Avatar) {
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
}

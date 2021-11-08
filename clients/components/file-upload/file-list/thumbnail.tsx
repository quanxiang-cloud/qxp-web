import React, { useEffect, useState } from 'react';

import Icon from '@c/icon';
import httpClient from '@lib/http-client';

import { IMG_THUMBNAIL_API } from '../constants';

type Props = {
  imgPath: string;
  imgName: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  onError?: (error?: any) => void;
}

export default function Thumbnail({
  style,
  onError,
  imgPath,
  imgName,
  size = 80,
  className,
}: Props): JSX.Element {
  const [thumbnailSrc, setThumbnailSrc] = useState('');
  useEffect(() => {
    let isSubscribed = true;

    !imgPath.includes('qxp-file') &&
      httpClient(IMG_THUMBNAIL_API, {
        path: imgPath,
        width: size,
        hight: size,
      }).then((res: any) => {
        isSubscribed && setThumbnailSrc(res.info);
      }).catch(onError);

    return () => {
      isSubscribed = false; // deny the thumbnailSrc update for memory leaking
    };
  }, []);

  if (!thumbnailSrc) {
    return (
      <Icon
        name="insert_photo"
        className="text-current animate-pulse"
        size={size}
      />
    );
  }

  return (
    <img
      width={size}
      height={size}
      src={thumbnailSrc}
      style={style}
      alt={imgName}
      className={className}
      onError={(onError)}
    />
  );
}

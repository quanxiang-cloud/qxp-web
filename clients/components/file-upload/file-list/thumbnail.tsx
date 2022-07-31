import React, { useEffect, useState } from 'react';

import Icon from '@c/icon';
import httpClient from '@lib/http-client';

import { FILE_DOWNLOAD_INFO_API, OSS_DOMAIN, OSS_PUBLIC_BUCKET_NAME } from '../constants';

type Props = {
  imgPath: string;
  imgName: string;
  fileBucket: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  original?: boolean
  onError?: (error?: any) => void;
}

export default function Thumbnail({
  style,
  onError,
  imgPath,
  imgName,
  original,
  size = 80,
  className,
  fileBucket,
}: Props): JSX.Element {
  const [thumbnailSrc, setThumbnailSrc] = useState('');
  useEffect(() => {
    if (imgPath.split('/')[0] === 'qxp-file') return;

    if (original) {
      setThumbnailSrc(`${window.location.protocol}//${OSS_PUBLIC_BUCKET_NAME}.${OSS_DOMAIN}/${imgPath}`);
      return;
    }
    const zoomSize = size / 2;
    let isMounted = true;
    const thumbnailPath = `${fileBucket}/${imgPath}`.split('/');
    thumbnailPath.splice(-1, 0, `${zoomSize}x${0}`);
    httpClient<{ url: string }>(FILE_DOWNLOAD_INFO_API, {
      path: thumbnailPath.join('/'),
    }).then(({ url }) => {
      if (!url) throw Error('缩略图下载失败');
      isMounted && setThumbnailSrc(url);
    }).catch((err) => {
      onError?.(err);
    });

    return () => {
      isMounted = false; // deny the thumbnailSrc update to void memory leaking
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

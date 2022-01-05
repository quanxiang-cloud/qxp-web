import React from 'react';

import { NumberString, Props } from '@m/qxp-ui-mobile';
import { Attachment } from '@m/pages/msg-center/detail/utils';
import Link from '@m/qxp-ui-mobile/link';
import { addUnit } from '@m/qxp-ui-mobile/utils/format/unit';

export interface MessageFileListProps extends Props {
  files?: Attachment[];
  preview?: boolean;
  spacer?: NumberString;
}

const regImage = /jpe?g|png|gif|svg/i;

const isImageExt = (filename: string): boolean => {
  const parts = filename.split('.');
  const name = parts[parts.length - 1];
  return regImage.test(name);
};

export default function MessageFileList({
  files, preview, spacer = '.16rem', className, style,
}: MessageFileListProps): JSX.Element | null {
  if (!files?.length) return null;

  const spacerStyle = { marginTop: addUnit(spacer) };

  return (
    <div className={className} style={style}>
      {files.map((file, index) => {
        // Todo: Add sign upload url check
        if (preview && (isImageExt(file.fileName) || isImageExt(file.url))) {
          return (
            <Link href={file.fileName}
              target='_blank'
              style={index > 0 ? spacerStyle : undefined}
              className='body1 text-highlight'
              key={index}>
              <img alt={file.fileName} src={file.url}/>
            </Link>
          );
        }
        return (
          <Link href={file.fileName}
            target='_blank'
            style={index > 0 ? spacerStyle : undefined}
            className='body1 text-highlight'
            key={index}>
            {file.fileName}
          </Link>
        );
      })}
    </div>
  );
}

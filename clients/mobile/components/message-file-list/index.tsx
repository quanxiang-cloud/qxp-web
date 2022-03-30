import React, { useEffect, useState } from 'react';

import { NumberString, Props } from '@m/qxp-ui-mobile';
import { Attachment } from '@m/pages/msg-center/detail/utils';
import Link from '@m/qxp-ui-mobile/link';
import { addUnit } from '@m/qxp-ui-mobile/utils/format/unit';
import { getDownloadUrl } from '@m/components/file-list/utils';
import Loading from '@m/qxp-ui-mobile/loading';

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

  const spacerStyle = { marginTop: addUnit(spacer), display: 'block' };
  const block = { display: 'block' };
  const [state, setState] = useState({
    loading: true,
    files,
  });
  useEffect(() => {
    Promise.all(files.map((file) => getDownloadUrl({
      uid: file.url,
      name: file.fileName,
      type: '',
      size: 0,
    }))).then((res) => {
      setState({
        loading: false,
        files: files.map((file, index) => ({ ...file, url: res[index] ?? '' })),
      });
    });
  }, [files]);

  return (
    <>
      {state.loading && <Loading>加载中...</Loading>}
      {!state.loading && (
        <div className={className} style={style}>
          {state.files.map((file, index) => {
            if (preview && (isImageExt(file.fileName) || isImageExt(file.url))) {
              return (
                <Link href={file.url}
                  target='_blank'
                  style={index > 0 ? spacerStyle : block}
                  className='body1 text-highlight'
                  key={index}>
                  <img alt={file.fileName} src={file.url}/>
                </Link>
              );
            }
            return (
              <Link href={file.url}
                target='_blank'
                style={index > 0 ? spacerStyle : block}
                className='body1 text-highlight'
                key={index}>
                {file.fileName}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

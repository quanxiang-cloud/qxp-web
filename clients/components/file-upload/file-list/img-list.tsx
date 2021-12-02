import React from 'react';
import cs from 'classnames';
import Icon from '@c/icon';
import toast from '@lib/toast';

import Thumbnail from './thumbnail';
import { FILE_LIST_ICON, THUMBNAIL_SIZE } from '../constants';

type Props = {
  files: QXPUploadFileTask[];
  className?: string;
  canDownload?: boolean;
  style?: React.CSSProperties;
  handleDownload?: (file: QXPUploadFileTask) => void;
  deleteFileItem?: (file: QXPUploadFileTask) => void;
  uploadProgressRender?: (file: QXPUploadFileTask) => React.ReactNode;
}

export function ImgList({
  files,
  style,
  className,
  canDownload = true,
  handleDownload,
  deleteFileItem,
  uploadProgressRender,
}:Props): JSX.Element {
  return (
    <>
      {files.map((file) => {
        const { uid, name, state } = file;
        return (
          <div
            key={uid}
            style={style}
            className={cs(
              'w-56 h-56 relative flex justify-center items-center rounded-4 mr-4 mb-4',
              'border-1 transition-all duration-300 hover:border-blue-600 qxp-img-item',
              {
                'border-blue-600 border-dashed': state === 'uploading',
                'border-red-600 border-solid text-red-600 ': state === 'failed',
              }, className,
            )}
          >
            <div title={name} >
              {
                state && state !== 'success' && (
                  <div
                    className="flex flex-col justify-center items-center">
                    {state && (<Icon {...FILE_LIST_ICON[state]} />)}
                    <span className="text-12">
                      {uploadProgressRender?.(file)}
                    </span>
                  </div>)
              }
              {
                (state === 'success' || !state) && (
                  <>
                    <Thumbnail
                      imgPath={`${file.uid?.split('/')[0]}/${file.uid?.split('/')[1]}`}
                      imgName={file.name}
                      size={THUMBNAIL_SIZE}
                      onError={(error) => {
                        toast.error(error.message);
                      }} />
                    <div
                      className={cs(
                        'w-52 h-52 absolute top-1 left-1 transition-opacity duration-300',
                        'opacity-0 hover:opacity-100 text-12 text-gray-400',
                        'flex justify-center items-center z-10 bg-gray-900 qxp-file-img-opt',
                      )}
                    >
                      {
                        canDownload && (
                          <Icon
                            {...FILE_LIST_ICON['download']}
                            clickable
                            onClick={() => handleDownload?.(file)}
                          />)
                      }
                      {
                        deleteFileItem && (
                          <span className="ml-4">
                            <Icon
                              {...FILE_LIST_ICON['delete']}
                              clickable
                              onClick={() => deleteFileItem?.(file)}
                            />
                          </span>)
                      }
                    </div>
                  </>
                )
              }
            </div>
          </div>
        );
      })}
    </>
  );
}

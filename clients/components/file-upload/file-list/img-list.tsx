/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable max-len */
import React, { useState } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';
import { EyeOutlined } from '@ant-design/icons';

import Thumbnail from './thumbnail';
import { FILE_DOWNLOAD_INFO_API, FILE_LIST_ICON, OSS_DOMAIN, OSS_PRIVATE_BUCKET_NAME, OSS_PUBLIC_BUCKET_NAME, THUMBNAIL_SIZE } from '../constants';
import { Modal } from 'antd';
import httpClient from '@lib/http-client';

type Props = {
  files: QXPUploadFileTask[];
  className?: string;
  canDownload?: boolean;
  fileBucket: string;
  style?: React.CSSProperties;
  originalThumbnail?: boolean,
  handleDownload?: (file: QXPUploadFileTask) => void;
  deleteFileItem?: (file: QXPUploadFileTask) => void;
  uploadProgressRender?: (file: QXPUploadFileTask) => React.ReactNode;
}

export function ImgList({
  files,
  style,
  className,
  fileBucket,
  canDownload = true,
  handleDownload,
  deleteFileItem,
  originalThumbnail,
  uploadProgressRender,
}: Props): JSX.Element {
  const [fileImgObj, setFileImgObj] = useState([]);

  const handleFileSrc = (file: any, index: any)=>{
    const _fileImgObj: any = [...fileImgObj];
    if (file.state === 'success' || !file.state) {
      const { uid } = file;
      if (!(fileBucket === OSS_PRIVATE_BUCKET_NAME)) {
        _fileImgObj[index] = `${window.location.protocol}//${OSS_PUBLIC_BUCKET_NAME}.${OSS_DOMAIN}/${uid}`;
        setFileImgObj(_fileImgObj);
        return;
      }

      httpClient<{ url: string }>(FILE_DOWNLOAD_INFO_API, {
        path: `${OSS_PRIVATE_BUCKET_NAME}/${uid}`,
        fileName: file.name,
      })
        .then(({ url }) => {
          _fileImgObj[index] = url;
          setFileImgObj(_fileImgObj);
        });
    }
  };

  const handlePreview = (index: number)=>{
    Modal.confirm({
      title: '',
      icon: '',
      okText: '',
      cancelText: '',
      width: 'fit-content',
      closable: true,
      className: 'preview-img-modal',
      content: (
        <div>
          <img width={'auto'} height={'auto'} src={fileImgObj[index]} />
        </div>
      ),
    });
  };

  return (
    <>
      {files.map((file, index) => {
        const { uid, name, state } = file;
        return (
          <div
            key={uid}
            style={style}
            className={cs(
              'w-64 h-64 relative flex justify-center items-center rounded-4 overflow-hidden',
              'border-1 transition-all duration-300 hover:border-blue-600 qxp-img-item flex-shrink-0',
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
                      fileBucket={fileBucket}
                      original={originalThumbnail}
                      imgPath={uid}
                      imgName={name}
                      size={THUMBNAIL_SIZE}
                      getThumbnailSrc = {()=>handleFileSrc(file, index)}
                    />
                    <div
                      className={cs(
                        'w-full h-full absolute top-0 left-0 transition-opacity duration-300',
                        'opacity-0 hover:opacity-100 text-white text-12',
                        'flex justify-center items-center bg-gray-900 qxp-file-img-opt',
                      )}
                    >
                      <EyeOutlined className='img-icon-eye' onClick={()=>handlePreview(index)}/>
                      <Icon
                        {...FILE_LIST_ICON['download']}
                        clickable
                        onClick={() => handleDownload?.(file)}
                      />
                      {
                        deleteFileItem && (
                          <span className="">
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

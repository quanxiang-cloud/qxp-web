import React, { useState, useEffect } from 'react';
import Icon from '@one-for-all/icon';
import { Input } from '@one-for-all/headless-ui';
import usePopper from '@c/popper2';

import FileUploader from '@c/file-upload';
import toast from '@lib/toast';
export interface UrlInputProps {
  value: string;
  onChange: (val: string) => void;
}

function UrlInput({ value, onChange }: UrlInputProps): JSX.Element {
  const [urlString, setUrlString] = useState<string>(value);
  const [imageData, setImageData] = useState<QXPUploadFileTask[]>([]);
  const { Popper, handleClick, referenceRef } = usePopper<HTMLDivElement>();

  useEffect(() => {
    onChange(urlString);
  }, [urlString]);

  function handleFileSuccess(file: QXPUploadFileTask): void {
    const { readable: readableBucket, domain }: OSSConfig = window.CONFIG.oss_config;
    setImageData([file]);
    const url = `${window.location.protocol}//${readableBucket}.${domain}/${file.uid}`;
    setUrlString(url);
  }

  function handleFileError(err: Error): void {
    toast.error(err.message);
  }

  return (
    <div className='relative w-full'>
      <Input className='w-full pr-24' value={urlString} onChange={(val: string) => setUrlString(val)} />
      <div
        ref={referenceRef}
        className='w-16 h-16 absolute cursor-pointer top-0 bottom-0 m-auto right-5'
        onClick={handleClick()}
      ><Icon name='upload_file' /></div>
      <Popper placement='bottom'>
        <div
          className='p-10 bg-white border-2 border-gray-100'
          style={{ width: 300, height: 200 }}
        >
          <FileUploader
            isPrivate={false}
            iconName="image"
            className="form-upload"
            uploaderDescription={
              (<>
                <div className="my-4">点击或拖拽图片到此区域</div>
                <div className="text-gray-400">支持 10MB 以内的 gif/jpg/png/svg 文件</div>
              </>)
            }
            maxFileSize={10}
            additionalPathPrefix="page-design-img"
            accept={[
              'image/gif',
              'image/jpeg',
              'image/jpg',
              'image/png',
              'image/svg',
            ]}
            onFileSuccess={handleFileSuccess}
            onFileError={handleFileError}
            fileData={imageData}
          />
        </div>
      </Popper>
    </div>
  );
}

export default UrlInput;

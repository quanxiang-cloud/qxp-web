import React, { useState, useEffect } from 'react';
import Icon from '@one-for-all/icon';
import { Input } from '@one-for-all/headless-ui';
import usePopper from '@c/popper2';

import FileUploader from '@c/file-upload';
export interface UrlInputProps{
  value: string;
  onChange: (val: string) => void;
}

function UrlInput({ value, onChange }: UrlInputProps): JSX.Element {
  const [urlString, setUrlString] = useState<string>(value);
  const { Popper, handleClick, referenceRef } = usePopper<HTMLDivElement>();

  useEffect(() => {
    onChange(urlString);
  }, [urlString]);

  function handleFileSuccess(file: QXPUploadFileTask): void {
    const { readable: readableBucket, domain }: OSSConfig = window.CONFIG.oss_config;
    if (file.state === 'success' || !file.state) {
      const url = `${window.location.protocol}//${readableBucket}.${domain}/${file.uid}`;
      setUrlString(url);
      onChange(urlString);
    }
  }

  return (
    <div className='relative'>
      <Input className='w-full' value={urlString} onChange={(val: string) => setUrlString(val)}/>
      <div
        ref={referenceRef}
        className='w-16 h-16 absolute cursor-pointer top-0 bottom-0 m-auto right-5'
        onClick={handleClick()}
      ><Icon name='upload_file' /></div>
      <Popper placement='bottom'>
        <div
          className='p-10 bg-white border-2 border-gray-100'
          style={{ width: 400, height: 200 }}
        >
          <div className='w-full h-full flex items-center
            justify-center border border-dashed border-gray-100'>
            <FileUploader
              className="px-40 form-upload"
              uploaderDescription={
                (<>
                  <div className="my-4">点击或拖拽文件到此区域</div>
                  <div className="text-gray-400">支持 20MB 以内的 csv 文件</div>
                </>)
              }
              isPrivate={false}
              maxFileSize={10}
              additionalPathPrefix="message"
              accept={[
                'image/gif',
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/svg',
              ]}
              onFileSuccess={handleFileSuccess}
            >
              <Icon name="upload_file" />
            </FileUploader>
          </div>
        </div>
      </Popper>
    </div>
  );
}

export default UrlInput;

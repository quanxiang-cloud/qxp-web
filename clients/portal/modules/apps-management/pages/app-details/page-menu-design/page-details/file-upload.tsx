import React from 'react';
import { useParams } from 'react-router-dom';
import { Upload } from '@QCFE/lego-ui';

import Icon from '@c/icon';
import toast from '@lib/toast';

import { Resp } from '../../type';

type Props = {
  onStart: (file: any) => void,
  onProgress: (step: any, file: any) => void,
  onSuccess: ({ code, data, msg }: Resp, file: { name: string, size: number }) => void
}

const maxSize = 1024 * 1024 * 30;

function FileUpload({ onStart, onProgress, onSuccess }: Props): JSX.Element {
  const { appID } = useParams<{ appID: string }>();

  return (
    <div>
      <Upload
        name="file"
        action="/upload"
        data={{ appID }}
        beforeUpload={(file) => {
          if (file.size > maxSize) {
            // follow backend config
            toast.error('文件大小不能超过30M');
            return false;
          }
          return true;
        }}
        onStart={onStart}
        onProgress={onProgress}
        onSuccess={onSuccess}
        onError={(err) => toast.error(err.message)}
      >
        <div className="text-gray-600">
          <div
            className="upload-box py-20 flex flex-col items-center select-none"
          >
            <Icon name="backup" size={24} />
            <span className="mt-10">点击该区域上传文件。支持 zip 格式，单个文件不超过 30M。</span>
          </div>
        </div>
      </Upload>
    </div>
  );
}

export default FileUpload;

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { Upload, Progress } from '@QCFE/lego-ui';

import Button from '@c/button';
import toast from '@lib/toast';

type Resp = {
  code: number;
  data: { url: string };
}

type FileInfo = {
  url: string;
  filename?: string;
  percentage?: number;
  showProgress?: boolean;
}

function FileUpload({ mutators, value }: ISchemaFieldComponentProps): JSX.Element {
  const { appID } = useParams<{ appID: string }>();
  const defaultVal = value ? { url: value } : null;
  const [file, setFile] = useState<FileInfo | null>(defaultVal);
  const onSuccess = ({ code, data }: Resp, file: { name: string }) => {
    if (code === 0) {
      setFile({
        filename: file.name,
        url: data.url,
        percentage: 100,
        showProgress: false,
      });

      mutators.change(data.url);
    }
  };

  return (
    <div>
      <Upload
        name="file"
        data={{ appID }}
        action="/upload"
        beforeUpload={(file) => {
          if (file.size > 1024 * 1024 * 30) {
            // follow backend config
            toast.error('文件大小不能超过30M');
            return false;
          }
          return true;
        }}
        onStart={(file) => {
          setFile({
            filename: file.name,
            url: '',
            percentage: 0,
            showProgress: true,
          });
        }}
        onProgress={(step, file) => {
          // @ts-ignore
          const percent = typeof step?.percent === 'number' ? Math.round(step.percent) : 0;
          // @ts-ignore
          setFile({
            ...file,
            filename: file.name,
            percentage: percent,
            showProgress: true,
          });
        }}
        onSuccess={onSuccess}
        onError={(err) => toast.error(err.message)}
      >
        <div>
          <div className="flex items-center flex-wrap">
            <Button>上传文件</Button>
            {file?.showProgress && (
              <Progress
                className='mx-20'
                percent={file?.percentage}
                key={file?.url}
              />
            )}
            {file && (
              <p className="ml-10">{file?.filename || file?.url}</p>
            )}
          </div>
          <p className="text-gray-400">单个文件不能超过30M</p>
        </div>
      </Upload>
    </div>
  );
}

FileUpload.isFieldComponent = true;

export default FileUpload;

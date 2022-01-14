import React from 'react';

import { FilePicker, FileList } from '@c/file-upload';
import toast from '@lib/toast';

import { Resp } from '../../type';

type Props = {
  onStart: (file: File) => void,
  onProgress: (file: QXPUploadFileTask, progress: number) => void,
  onSuccess: ({ code, data, msg }: Resp, file: QXPUploadFileTask) => void
  files: QXPUploadFileTask[];
  appID: string;
}

const MAX_SIZE = 1024 * 1024 * 30;

function CustomPageUpload({ appID, files, onStart, onProgress, onSuccess }: Props): JSX.Element {
  return (
    <div>
      <FilePicker
        className="p-20"
        accept={'application/zip,application/x-zip-compressed,application/x-rar-compressed'}
        multiple={false}
        description="点击该区域上传文件。支持 zip 格式，单个文件不超过 30M。"
        onSelectFiles={(files) => {
          const file = files[0];
          if (file.size > MAX_SIZE) {
            toast.error('文件大小不能超过30M');
            return;
          }
          onStart(file);
          customPageUploadHandler({ file, appID, onError: (reason: Error) => {
          }, onSuccess, onProgress });
        }}
      />
      <FileList files={files} canDownload={false} />
    </div>
  );
}

export default CustomPageUpload;

function customPageUploadHandler({
  file,
  appID,
  onError,
  onProgress,
  onSuccess,
}: any): void {
  const xhr = new XMLHttpRequest();

  new Promise<void>((resolve, reject) => {
    const formData = new FormData();
    formData.append('appID', appID);
    formData.append('file', file);

    xhr.open('post', '/upload');
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.ceil(event.loaded / event.total * 100);
        onProgress?.(file, progress);
      }
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      }
    };

    xhr.onerror = (err) => {
      reject(err);
    };
    xhr.onabort = (reason) => {
      reject(reason);
    };
    xhr.upload.onabort = (err) => {
      reject(err);
    };

    xhr.send(formData);
  }).then((res) => {
    onSuccess?.(res, file);
  }).catch((reason) => {
    onError?.(reason, file);
  });
}

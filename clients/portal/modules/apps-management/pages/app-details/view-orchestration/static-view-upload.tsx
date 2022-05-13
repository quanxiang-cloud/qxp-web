import React, { useEffect, useState } from 'react';

import toast from '@lib/toast';
import { FilePicker, FileList } from '@c/file-upload';

import { Resp } from '../type';
import { useParams } from 'react-router-dom';

type ViewProps = {
  onStart: (file: File) => void,
  onProgress: (file: QXPUploadFileTask, progress: number) => void,
  onSuccess: ({ code, data, msg }: Resp, file: QXPUploadFileTask) => void
  files: QXPUploadFileTask[];
  appID: string;
}

const MAX_SIZE = 1024 * 1024 * 30;

function CustomPageUpload({ appID, files, onStart, onProgress, onSuccess }: ViewProps): JSX.Element {
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

interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

function StaticViewUpload({ value, onChange }: Props): JSX.Element {
  const { appID } = useParams<{ appID: string }>();
  const [files, setFiles] = useState<QXPUploadFileTask[]>([]);

  function onSuccess({ code, data, msg }: Resp): void {
    if (code === 0 && data?.url) {
      setFiles((prevFiles) => [{
        ...prevFiles[0],
        uploadUrl: data.url,
        state: 'success',
      }]);
    } else {
      toast.error(msg || '上传失败');
    }
  }

  function onProgress(file: QXPUploadFileTask, progress: number ): void {
    setFiles((prevFiles) => [{
      ...prevFiles[0],
      progress: progress,
      state: 'uploading',
    }]);
  }

  function onStart(file: File): void {
    setFiles([{
      uid: file.name,
      name: file.name,
      type: file.type,
      size: file.size,
    }]);
  }

  useEffect(() => {
    onChange && onChange(files[0]?.uploadUrl ?? '');
  }, [files]);

  return (
    <div className="p-40">
      <CustomPageUpload
        files={files}
        appID={appID}
        onStart={onStart}
        onSuccess={onSuccess}
        onProgress={onProgress}
      />
      <p className="mt-8 select-none">支持上传静态的页面代码，包含 html、javascript、css、图片等。</p>
    </div>
  );
}

export default StaticViewUpload;

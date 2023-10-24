import httpClient from '@lib/http-client';

import { FINISH_FILE_UPLOAD_API, OSS_PUBLIC_BUCKET_NAME, OSS_DOMAIN } from '../constants';

import type { FileUploadStreamProps } from './large-file-part-upload-stream';

export default function smallFileUploadRequest({
  file,
  fileBucket,
  onError,
  onProgress,
  onSuccess,
}: FileUploadStreamProps): (() => void) {
  const { uploadUrl, blob } = file;

  if (!uploadUrl) throw new Error('No upload url provided');
  const xhr = new XMLHttpRequest();

  new Promise<void>((resolve, reject) => {
    xhr.open('put', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.ceil(event.loaded / event.total * 100);
        onProgress?.(file, progress);
      }
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve();
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

    xhr.send(blob);
  }).then(() => {
    return httpClient(FINISH_FILE_UPLOAD_API, { path: `${fileBucket}/${file.uid}` });
  }).then(() => {
    const fileDownloadURL = `${window.location.protocol}//${OSS_PUBLIC_BUCKET_NAME}.${OSS_DOMAIN}/${file.uid}`;
    const isPublic = fileBucket === OSS_PUBLIC_BUCKET_NAME;
    onSuccess?.({ ...file, ...(isPublic && { downLoadURL: fileDownloadURL }) });
  }).catch((reason) => {
    onError?.(reason, file);
  });

  return () => {
    onError?.(new Error(`已经取消 ${file.name} 的上传`), file);
    xhr.abort();
  };
}

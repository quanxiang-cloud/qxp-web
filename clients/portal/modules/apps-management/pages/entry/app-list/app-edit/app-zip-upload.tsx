import React from 'react';

import FileUpload from '@c/file-upload';

interface Props {
  value?: string;
  onChange?: (value: AppZipInfo | undefined) => void;
}

function appZipUpload({ onChange }: Props): JSX.Element {
  function handleFileSuccess(file: QXPUploadFileBaseProps): void {
    onChange?.({
      addr: file.uid,
      opt: 'minio',
      size: file.size,
      title: file.name,
    });
  }

  function handleFileDelete(): void {
    onChange?.(undefined);
  }

  function ZipUploadDescription(): JSX.Element {
    return (
      <>
        <div className="my-4">点击或拖拽文件到此区域</div>
        <div className="text-gray-400">（仅限于平台应用zip文件）</div>
      </>
    );
  }

  return (
    <FileUpload
      iconName="upload_file"
      className="app-upload"
      accept={['application/zip', 'application/x-zip-compressed']}
      uploaderDescription={<ZipUploadDescription />}
      onFileSuccess={handleFileSuccess}
      onFileDelete={handleFileDelete}
    />
  );
}

export default appZipUpload;

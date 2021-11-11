import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import cs from 'classnames';

import toast from '@lib/toast';
import { isMacosX } from '@lib/utils';

import FileList from '../file-list';
import FilePicker from './file-picker';
import useFileStore from './useFileStore';

export type FileUploaderProps = {
  accept?: string[];
  iconName?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  maxFileSize?: number;
  style?: React.CSSProperties;
  uploaderDescription?: string;
  fileData?: QXPUploadFileBaseProps[];
  onFileDelete?: (file: QXPUploadFileBaseProps) => void;
  onFileSuccess?: (file: QXPUploadFileBaseProps) => void;
  onFileError?: (err: Error, file: QXPUploadFileBaseProps) => void;
  onFileAbort?: (file: QXPUploadFileBaseProps | QXPUploadFileBaseProps[]) => void;
}

function FileUploader({
  style,
  multiple,
  disabled,
  iconName,
  className,
  accept = [],
  maxFileSize,
  fileData = [],
  uploaderDescription,
  onFileError,
  onFileAbort,
  onFileDelete,
  onFileSuccess,
}: FileUploaderProps): JSX.Element {
  const fileStore = useFileStore({ files: fileData, onSuccess: onFileSuccess, onError: onFileError });

  const {
    files: storeFiles,
    prepareFilesUpload,
    retryUploadFile,
    abortAllFiles,
    clearUploadFiles,
    removeUploadFile,
  } = fileStore;

  useEffect(() => {
    return () => {
      abortAllFiles();
      clearUploadFiles();
    };
  }, []);

  function deleteFileItem(deleteFile: QXPUploadFileTask): void {
    deleteFile.state === 'success' || !deleteFile.state ?
      onFileDelete?.(deleteFile) : onFileAbort?.(deleteFile);
    removeUploadFile(deleteFile);
  }

  function beforeUpload(preUploadFile: File, files: QXPUploadFileBaseProps[]): boolean {
    const byteSize = isMacosX ? 1000 : 1024;
    const maxSize = (byteSize ** 2) * (maxFileSize || 0);

    if (files.find((file) => file.name === preUploadFile.name)) {
      toast.error(`已存在名为'${preUploadFile.name}' 的文件。`);
      return false;
    }

    if (!multiple && files.length === 1) {
      toast.error('仅允许上传一个附件');
      return false;
    }

    if (multiple) {
      const preUploadTotalSize = files.reduce((total, currFile) => (total + currFile.size), 0);
      const uploadedTotalSize = files.reduce((total: number, currFile: { size: number; }) =>
        (total + currFile.size), preUploadTotalSize);
      if (maxSize && uploadedTotalSize > maxSize) {
        toast.error(`文件总大小不能超过${maxFileSize}MB`);
        return false;
      }
    }

    if (maxSize && preUploadFile.size > maxSize) {
      toast.error(`单个文件大小不能超过${maxFileSize}MB`);
      return false;
    }
    return true;
  }

  return (
    <div
      className={cs('qxp-file-uploader', className)}
      style={style}
    >
      <FilePicker
        className="w-full h-56 p-10"
        multiple={multiple}
        iconName={iconName}
        accept={accept.toString()}
        disabled={disabled || (!multiple && storeFiles.length >= 1)}
        description={(!multiple && storeFiles.length >= 1) ? '当前只能上传一个文件或图片' : uploaderDescription}
        onSelectFiles={(files) => {
          files.every((file)=> beforeUpload(file, storeFiles)) && prepareFilesUpload(files);
        }}
      />
      <FileList
        className="w-full"
        canDownload
        files={toJS(storeFiles)}
        deleteFileItem={deleteFileItem}
        onRetryFileUpload={retryUploadFile}
      />
    </div>
  );
}
export default observer(FileUploader);

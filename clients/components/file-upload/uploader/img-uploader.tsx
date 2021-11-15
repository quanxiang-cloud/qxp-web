import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import cs from 'classnames';

import toast from '@lib/toast';
import { isMacosX } from '@lib/utils';

import FileList from '../file-list';
import FilePicker from './file-picker';
import useFileStore from './useFileStore';
import type { FileUploaderProps } from './file-uploader';

function ImgUploader({
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
      toast.error(`已存在名为'${preUploadFile.name}' 的图片。`);
      return false;
    }

    if (multiple) {
      const preUploadTotalSize = files.reduce((total, currFile) => (total + currFile.size), 0);
      const uploadedTotalSize = files.reduce((total: number, currFile: { size: number; }) =>
        (total + currFile.size), preUploadTotalSize);
      if (maxSize && uploadedTotalSize > maxSize) {
        toast.error(`图片总大小不能超过${maxFileSize}MB`);
        return false;
      }
    }

    if (maxSize && preUploadFile.size > maxSize) {
      toast.error(`单个图片大小不能超过${maxFileSize}MB`);
      return false;
    }
    return true;
  }

  return (
    <div
      className={cs('qxp-img-uploader', className)}
      style={style}
    >
      <div className={cs('flex flex-wrap relative qxp-file-list-img', className)}>
        <FileList
          imgOnly={true}
          canDownload
          files={toJS(storeFiles)}
          deleteFileItem={deleteFileItem}
          onRetryFileUpload={retryUploadFile}
        />
        {
          (multiple || storeFiles.length < 1) && (
            <FilePicker
              className='w-56 h-56 m-0'
              multiple={multiple}
              iconName={iconName}
              accept={accept.toString()}
              disabled={disabled || (!multiple && storeFiles.length >= 1)}
              description={uploaderDescription || '上传图片'}
              onSelectFiles={(files) => {
                files.every((file)=> beforeUpload(file, storeFiles)) && prepareFilesUpload(files);
              }}
            />
          )
        }
      </div>
    </div>
  );
}
export default observer(ImgUploader);

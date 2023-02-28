import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import cs from 'classnames';

import toast from '@lib/toast';
import { isAcceptedFileType, isMacosX } from '@lib/utils';

import FileList from '../file-list';
import FilePicker from './file-picker';
import useFileStore from './useFileStore';
import type { FileUploaderProps } from './file-uploader';
import { OSS_PRIVATE_BUCKET_NAME, OSS_PUBLIC_BUCKET_NAME } from '../constants';

function ImgUploader({
  style,
  multiple,
  disabled,
  iconName,
  className,
  accept = [],
  maxFileSize,
  fileData = [],
  isPrivate = true,
  originalThumbnail,
  uploaderDescription,
  additionalPathPrefix,
  onFileError,
  canDownload,
  onFileAbort,
  onFileDelete,
  onFileSuccess,
}: FileUploaderProps): JSX.Element {
  const fileStore = useFileStore({
    fileBucket: isPrivate ? OSS_PRIVATE_BUCKET_NAME : OSS_PUBLIC_BUCKET_NAME,
    files: fileData,
    additionalPathPrefix,
    requestThumbnail: !originalThumbnail,
    onError: onFileError,
    onSuccess: onFileSuccess,
  });

  const {
    files: storeFiles,
    prepareFilesUpload,
    retryUploadFile,
    abortAllFiles,
    clearUploadFiles,
    removeUploadFile,
    setUploadedFiles,
  } = fileStore;

  useEffect(() => {
    return () => {
      abortAllFiles();
      clearUploadFiles();
    };
  }, []);

  useEffect(()=> {
    setUploadedFiles(fileData);
  }, [fileData]);

  function deleteFileItem(deleteFile: QXPUploadFileTask): void {
    deleteFile.state === 'success' || !deleteFile.state ?
      onFileDelete?.(deleteFile) : onFileAbort?.(deleteFile);
    removeUploadFile(deleteFile);
  }

  function beforeUpload(preUploadFile: File, files: File[], storeFiles: QXPUploadFileBaseProps[]): boolean {
    const byteSize = isMacosX ? 1000 : 1024;
    const maxSize = (byteSize ** 2) * (maxFileSize || 0);

    if (accept && !isAcceptedFileType(preUploadFile, accept)) {
      toast.error(`图片 '${preUploadFile.name}' 的格式不正确`);
      return false;
    }

    if (storeFiles.find((file) => file.name === preUploadFile.name)) {
      toast.error(`已存在名为'${preUploadFile.name}' 的图片。`);
      return false;
    }

    if (!multiple && (files.length !== 1 || storeFiles.length === 1)) {
      toast.error('仅允许上传一张图片');
      return false;
    }

    if (multiple) {
      const preUploadTotalSize = files?.reduce((total, currFile) => (total + currFile.size), 0);
      const uploadedTotalSize = storeFiles?.reduce((total: number, currFile: { size: number; }) =>
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
      className={cs('flex flex-wrap gap-4 w-full max-h-144 overflow-auto relative qxp-img-uploader', className,
        {
          'is-mobile-qxp-img-uploader': window?.isMobile,
        },
      )}
      style={style}
    >
      <FileList
        imgOnly
        canDownload={canDownload}
        originalThumbnail={originalThumbnail}
        isPrivate={isPrivate}
        files={toJS(storeFiles)}
        deleteFileItem={deleteFileItem}
        onRetryFileUpload={retryUploadFile}
      />
      {
        (multiple || !storeFiles.length) && (
          <FilePicker
            className='w-64 h-64 bg-white z-10'
            multiple={multiple}
            iconName={iconName}
            accept={accept.toString()}
            disabled={disabled || (!multiple && !!storeFiles.length)}
            description={uploaderDescription || '上传图片'}
            onSelectFiles={(files) => {
              files.every((file)=> beforeUpload(file, files, storeFiles)) && prepareFilesUpload(files);
            }}
          />
        )
      }
    </div>
  );
}
export default observer(ImgUploader);

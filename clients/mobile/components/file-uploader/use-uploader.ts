import { useEffect } from 'react';

import useFileStore from '@c/file-upload/uploader/useFileStore';
import { OSS_PRIVATE_BUCKET_NAME, OSS_PUBLIC_BUCKET_NAME } from '@c/file-upload/constants';
import toast from '@lib/toast';
import { formatFileSize } from '@portal/modules/apps-management/pages/app-details/utils';

export const defaultMaxFileSize = 5 * 1024 * 1024;

export interface UseUploaderReturn {
  storeFiles: QXPUploadFileTask[];
  upload: (files: File[]) => void;
  retry: (file: QXPUploadFileTask) => void;
  remove: (file: QXPUploadFileTask) => void;
}

interface BeforeUploadProps {
  multiple: boolean;
  preUploadFile: File;
  files: QXPUploadFileBaseProps[];
  maxFileSize?: number;
}

export interface UseUploaderProps {
  multiple: boolean;
  maxFileSize?: number;
  defaultFiles?: LabelValue[];
}

function beforeUpload(props: BeforeUploadProps): boolean {
  if (props.files.find((file) => file.name === props.preUploadFile.name)) {
    toast.error(`已存在名为'${props.preUploadFile.name}' 的文件。`);
    return false;
  }

  if (!props.multiple && props.files.length >= 1) {
    toast.error('仅允许上传一个附件');
    return false;
  }

  if (props.maxFileSize && props.preUploadFile.size > props.maxFileSize) {
    toast.error(`单个附件大小不能超过 ${formatFileSize(props.maxFileSize)}`);
    return false;
  }
  return true;
}

function toQXPUploadFileBaseProps(files: LabelValue[]): QXPUploadFileBaseProps[] {
  return files.map((file) => ({
    uid: file.value,
    type: '',
    name: file.label,
    size: 0,
    state: 'success',
  }));
}

export function useUploader(props: UseUploaderProps, isPrivate = true): UseUploaderReturn {
  const fileStore = useFileStore({
    files: toQXPUploadFileBaseProps(props.defaultFiles ?? []),
    fileBucket: isPrivate ? OSS_PRIVATE_BUCKET_NAME : OSS_PUBLIC_BUCKET_NAME,
  });
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

  const upload = (files: File[]): void => {
    files.every((file)=> beforeUpload({
      preUploadFile: file,
      multiple: props.multiple,
      maxFileSize: props.maxFileSize,
      files: storeFiles,
    })) && prepareFilesUpload(files);
  };

  return {
    storeFiles,
    upload,
    retry: retryUploadFile,
    remove: removeUploadFile,
  };
}

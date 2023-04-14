import FileUploader from '@c/file-upload';
import toast from '@lib/toast';
import React, { useEffect, useRef } from 'react';

export interface Props {
  accept?: string;
  iconName?: string;
  isPrivate?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  maxFileSize?: number;
  uploaderDescription?: string;
  uploadedFilesJson: string;
  style?: React.CSSProperties;
  onFileSuccess?: (file: QXPUploadFileBaseProps) => void;
  onFileDelete?: (file: QXPUploadFileBaseProps) => void;
  onFileError?: (err: Error, file: QXPUploadFileBaseProps) => void;
  onFileAbort?: (file: QXPUploadFileBaseProps | QXPUploadFileBaseProps[]) => void;
}

const PATTERN = /(?<fileName>[\w\d-_.\s@%+]+)\.(?<type>\w+)$/;

function validateJson(json: string): string[] | null {
  try {
    const jsonObj = JSON.parse(json);
    return jsonObj;
  } catch (error) {
    return null;
  }
}

function FileUpload({ accept, uploadedFilesJson, ...rest }: Props): JSX.Element {
  const uploaderRef = useRef<any>(null);
  useEffect(() => {
    const fileUrlArr = validateJson(uploadedFilesJson || '[]');

    if (!fileUrlArr) {
      toast.error('文件列表JSON不合法');
      return;
    }
    const fileBaseInfoList = fileUrlArr?.map((downLoadURL) => {
      const match = PATTERN.exec(downLoadURL);
      let name = '';
      let type = '';
      if (match) {
        name = match.groups?.fileName || '';
        type = match.groups?.type || '';
      }

      return {
        name: `${name}.${type}`,
        type,
        uid: `${name}.${type}`,
        size: 0,
        downLoadURL,
      };
    });

    uploaderRef.current.setFiles(fileBaseInfoList);
  }, [uploadedFilesJson]);

  return (
    <FileUploader {...rest} ref={uploaderRef} accept={accept ? accept?.split(',') : undefined} />
  );
}

export default FileUpload;


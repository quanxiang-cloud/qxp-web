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
  filesSourceUrl: string
  style?: React.CSSProperties;
  onFileSuccess?: (file: QXPUploadFileBaseProps) => void;
}

function FileUpload({ accept, filesSourceUrl, ...rest }: Props): JSX.Element {
  const uploaderRef = useRef<any>(null);
  const controller = new AbortController();
  const { signal } = controller;

  // The file list json which fetch from url should be like type QXPUploadFileBaseProps
  async function fetchUrlFiles(url: string): Promise<QXPUploadFileBaseProps[]> {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
    });
    const data = await response.json();
    return data as QXPUploadFileBaseProps[];
  }
  useEffect(() => {
    if (filesSourceUrl) {
      fetchUrlFiles(filesSourceUrl).then((files) => {
        uploaderRef.current.setFiles(files);
      }).catch((e) => {
        if (e.name === 'AbortError') {
          return;
        }
        toast.error('Url外部文件列表获取失败');
      });
    }

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <FileUploader {...rest} ref={uploaderRef} accept={accept ? accept?.split(',') : undefined} />
  );
}

export default React.forwardRef(FileUpload);


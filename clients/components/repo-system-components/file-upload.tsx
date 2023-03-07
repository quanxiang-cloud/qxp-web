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

function FileUpload({ accept, filesSourceUrl, ...rest }: Props, ref: React.Ref<HTMLDivElement>): JSX.Element {
  const uploaderRef = useRef<any>(null);

  async function fetchUrlFiles(url: string): Promise<QXPUploadFileBaseProps[]> {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data as QXPUploadFileBaseProps[];
  }
  useEffect(() => {
    if (filesSourceUrl) {
      fetchUrlFiles(filesSourceUrl).then((files) => {
        uploaderRef.current.setFiles(files);
      }).catch(() => {
        toast.error('Url文件获取错误');
      });
      // line 27, The files which fetch from url api should be like this below format
      // make sure the files
      //   const files = [
      //     {
      //       name: 'xxxxxx',
      //       uid: 'xxxxxxxxxxxxxx',
      //       type: 'xxxxxxx',
      //       size: xxxxx,
      //     },
      //   ];
    }
  }, []);

  return (
    <FileUploader {...rest} ref={uploaderRef} accept={accept ? accept?.split(',') : undefined} />
  );
}

export default React.forwardRef(FileUpload);


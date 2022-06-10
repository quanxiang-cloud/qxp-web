import FileUploader from '@c/file-upload';
import React from 'react';

export interface Props {
  accept?: string;
  iconName?: string;
  isPrivate?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  maxFileSize?: number;
  uploaderDescription?: string;
  style?: React.CSSProperties;
  onFileSuccess?: (file: QXPUploadFileBaseProps) => void;
}

function FileUpload({ accept, ...rest }: Props, ref: React.Ref<HTMLDivElement>): JSX.Element {
  return <FileUploader {...rest} ref={ref} accept={accept ? accept?.split(',') : undefined} />;
}

export default React.forwardRef(FileUpload);

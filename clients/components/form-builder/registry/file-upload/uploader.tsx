import React, { useEffect, useRef } from 'react';

import FileUploader from '@c/file-upload';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import type { FileUploaderProps } from '@c/file-upload/uploader/file-uploader';

export type QxpFileFormData = {
  label: string;
  value: string;
  type: string;
  size: number;
}
export default function FormFileUploader(props: FileUploaderProps & ISchemaFieldComponentProps)
  : JSX.Element {
  const configProps = props?.props['x-component-props'];
  const subTableTempRef = useRef<QxpFileFormData[]>([]);
  const { value, mutators } = props;

  useEffect(() => {
    subTableTempRef.current = value;
  }, []);

  const handleFileSuccess = (currentFile: QXPUploadFileBaseProps): void => {
    const currentFileFromData:QxpFileFormData = {
      label: currentFile.name,
      value: currentFile.uid,
      type: currentFile.type,
      size: currentFile.size,
    };
    subTableTempRef.current.push(currentFileFromData);
    mutators.change(subTableTempRef.current);
  };

  const handleFileDelete = (currentFile: QXPUploadFileBaseProps): void => {
    subTableTempRef.current = subTableTempRef.current.filter(((file: QxpFileFormData) => {
      return file.label !== currentFile.name;
    }));
    mutators.change(subTableTempRef.current);
  };
  return (
    <FileUploader
      {...configProps}
      className='max-w-290'
      fileData={value?.map((file: QxpFileFormData) =>
        ({
          name: file.label,
          uid: file.value,
          type: file.type,
          size: file.size,
        }),
      )}
      disabled={!configProps.multiple && subTableTempRef.current?.length >= 1}
      onFileSuccess={handleFileSuccess}
      onFileDelete={handleFileDelete}
    />
  );
}

FormFileUploader.isFieldComponent = true;

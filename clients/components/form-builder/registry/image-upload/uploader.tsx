import React, { useRef, useEffect } from 'react';

import { ImgUploader } from '@c/file-upload';
import { DEFAULT_IMG_TYPES } from '@c/file-upload/constants';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import type { FileUploaderProps } from '@c/file-upload/uploader/file-uploader';
import type { QxpFileFormData } from '../file-upload/uploader';

export default function FormImgUploader(props: FileUploaderProps & ISchemaFieldComponentProps)
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
    <ImgUploader
      {...configProps}
      fileData={value?.map((file: QxpFileFormData) =>
        ({
          name: file.label,
          uid: file.value,
          type: file.type,
          size: file.size,
        }),
      )}
      iconName="image"
      disabled={!configProps.multiple && subTableTempRef.current?.length >= 1}
      accept={DEFAULT_IMG_TYPES}
      onFileSuccess={handleFileSuccess}
      onFileDelete={handleFileDelete}
    />
  );
}

FormImgUploader.isFieldComponent = true;

import React from 'react';

import { ImgUploader, FileList } from '@c/file-upload';
import { DEFAULT_IMG_TYPES } from '@c/file-upload/constants';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import type { FileUploaderProps } from '@c/file-upload/uploader/file-uploader';
import type { QxpFileFormData } from '../file-upload/uploader';

export default function FormImgUploader(props: FileUploaderProps & ISchemaFieldComponentProps): JSX.Element {
  const { value, form, path } = props;
  const { readOnly } = props.props;
  const configProps = props?.props['x-component-props'];

  function handleFileSuccess(currentFile: QXPUploadFileBaseProps): void {
    const currentFileFormData: QxpFileFormData = {
      label: currentFile.name,
      value: currentFile.uid,
      type: currentFile.type,
      size: currentFile.size,
    };
    pushFieldValue(currentFileFormData);
  }

  function handleFileDelete(currentFile: QXPUploadFileBaseProps): void {
    const newFiles = value.filter(((file: QxpFileFormData) => {
      return file.label !== currentFile.name;
    }));
    setFieldValue(newFiles);
  }

  function pushFieldValue(value: QxpFileFormData): void {
    form.setFieldValue(path, [...form.getFieldValue(path), value]);
  }

  function setFieldValue(value: QxpFileFormData[]): void {
    form.setFieldValue(path, value);
  }
  if (readOnly) {
    return (
      <div className="max-w-290">
        <FileList
          imgOnly
          files={value?.map((file: QxpFileFormData) =>
            ({
              name: file.label,
              uid: file.value,
              type: file.type,
              size: file.size,
            }),
          ) || []}
        />
      </div>

    );
  }

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
      disabled={!configProps.multiple && value?.length >= 1}
      accept={DEFAULT_IMG_TYPES}
      onFileSuccess={handleFileSuccess}
      onFileDelete={handleFileDelete}
    />
  );
}

FormImgUploader.isFieldComponent = true;

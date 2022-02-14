import React from 'react';
import { useParams } from 'react-router-dom';

import { getQuery } from '@lib/utils';
import FileUploader, { FileList } from '@c/file-upload';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import type { FileUploaderProps } from '@c/file-upload/uploader/file-uploader';

export type QxpFileFormData = {
  label: string;
  value: string;
  type: string;
  size?: number;
}
export default function FormFileUploader(props: FileUploaderProps & ISchemaFieldComponentProps): JSX.Element {
  const { value, form, path } = props;
  const { readOnly } = props.props;
  const configProps = props?.props['x-component-props'];
  const { pageID } = getQuery<{ pageID: string }>();
  const { appID } = useParams<{ appID: string }>();

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
      <div className="w-280">
        <FileList
          files={value.map((file: QxpFileFormData) =>
            ({
              name: file.label,
              uid: file.value,
              type: file.type,
              size: file.size,
            }),
          )}
        />
      </div>
    );
  }

  return (
    <FileUploader
      {...configProps}
      className='w-280'
      additionalPathPrefix={`${appID}/${pageID}`}
      fileData={value?.map((file: QxpFileFormData) =>
        ({
          name: file.label,
          uid: file.value,
          type: file.type,
          size: file.size,
        }),
      )}
      disabled={!configProps.multiple && value?.length >= 1}
      onFileSuccess={handleFileSuccess}
      onFileDelete={handleFileDelete}
    />
  );
}

FormFileUploader.isFieldComponent = true;

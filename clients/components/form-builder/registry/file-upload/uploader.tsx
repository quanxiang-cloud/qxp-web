import React, { useContext } from 'react';

import FileUploader, { FileList } from '@c/file-upload';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import type { FileUploaderProps } from '@c/file-upload/uploader/file-uploader';
import { TableContext } from '@home/pages/app-table-view-detail';

export type QxpFileFormData = {
  label: string;
  value: string;
  type: string;
  size?: number;
}
export default function FormFileUploader(props: FileUploaderProps & ISchemaFieldComponentProps): JSX.Element {
  const { appID, tableID } = useContext(TableContext);
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
      className='w-full max-w-290'
      additionalPathPrefix={`/app/${appID}/form-attachment/${tableID}`}
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

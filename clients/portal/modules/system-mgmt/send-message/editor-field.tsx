import React, { useState, forwardRef, useRef, useImperativeHandle } from 'react';

import FileUploader from '@c/file-upload/uploader/file-uploader';
import toast from '@lib/toast';
import QuillEditor, { Quill } from '@c/quill';

type FieldValues = {
  content: string;
  files: QXPUploadFileBaseProps[];
}

export type RefProps = {
  getValue: () => FieldValues;
}

interface Props {
  value?: FieldValues;
}

function EditorField({ value }: Props, ref: React.Ref<RefProps>): JSX.Element {
  const quillRef = useRef<Quill>(null);
  const [files, setFiles] = useState<QXPUploadFileBaseProps[]>((value?.files || []).map((itm: any) => ({
    uid: itm.uid,
    type: itm.file_type,
    name: itm.name,
    size: itm.file_size,
  })));

  useImperativeHandle(ref, () => {
    return {
      getValue: (): FieldValues => {
        const content = quillRef.current?.root.innerHTML || '';
        return {
          content,
          files,
        };
      },
    };
  });

  function handleFileSuccessUpload(file: QXPUploadFileBaseProps): void {
    setFiles((currentFiles) => {
      return [...currentFiles, file];
    });
  }

  function deleteFiles(currentFile: QXPUploadFileBaseProps): void {
    setFiles((prevFiles) => {
      const filteredFiles = prevFiles.filter((file) => file.name !== currentFile.name);
      return filteredFiles;
    });
  }

  return (
    <div className="border border-gray-300 corner-2-8-8-8 rdw-editor-wrapper">
      <QuillEditor ref={quillRef} initialValue={(value && value.content) || ''} />
      <div className="p-16">
        <FileUploader
          fileData={files}
          isPrivate={false}
          multiple
          maxFileSize={5}
          additionalPathPrefix='message'
          uploaderDescription="上传附件"
          onFileSuccess={handleFileSuccessUpload}
          onFileError={(err) => toast.error(err.message)}
          onFileDelete={deleteFiles}
        />
      </div>
    </div>
  );
}

export default forwardRef<RefProps, Props>(EditorField);

import React, { useState, useEffect, useRef } from 'react';
import ReactDom from 'react-dom';
import { Editor } from 'react-draft-wysiwyg';

import { EditorState, ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import FileUploader from '@c/file-upload/uploader/file-uploader';
import toast from '@lib/toast';

import editorToolbarOptions from './editor-toolbar';

type FieldValues = {
  content: any;
  files: any[];
}

interface Props {
  value?: FieldValues;
  onChange?: (values: FieldValues) => void;
}

function EditorField({ value, onChange }: Props): JSX.Element {
  const saveRef = useRef<EditorState | null>(null);
  const [dom, setDom] = useState<Element | null>(null);
  const [files, setFiles] = useState<QXPUploadFileBaseProps[]>((value?.files || []).map((itm: any) => ({
    uid: itm.uid,
    type: itm.file_type,
    name: itm.name,
    size: itm.file_size,
  })));

  const [editorCont, setEditorCont] = useState(value && value.content ?
    EditorState.createWithContent(
      ContentState.createFromBlockArray(
        htmlToDraft(value.content).contentBlocks),
    ) : EditorState.createEmpty());
  saveRef.current = editorCont;

  useEffect(() => {
    setDom(document.getElementById('rdw-wrapper-8888'));
  }, []);

  function getEditorCont(cont: EditorState, asRaw?: boolean): any {
    const raw = convertToRaw(cont.getCurrentContent());
    return asRaw ? raw : draftToHtml(raw);
  }

  function handleChangeEditor(editorState: EditorState): void {
    setEditorCont(editorState);
    onChange && onChange({
      content: getEditorCont(editorState),
      files,
    });
  }

  function handleFileSuccessUpload(file: QXPUploadFileBaseProps): void {
    setFiles((currentFiles) => {
      onChange && onChange({
        content: getEditorCont(saveRef.current as EditorState),
        files: [...currentFiles, file],
      } as FieldValues);
      return [...currentFiles, file];
    });
  }

  function deleteFiles(currentFile: QXPUploadFileBaseProps): void {
    setFiles((prevFiles) => {
      const filteredFiles = prevFiles.filter((file) => file.name !== currentFile.name);
      onChange && onChange({
        content: getEditorCont(editorCont),
        files: filteredFiles,
      });
      return filteredFiles;
    });
  }

  return (
    <div>
      <Editor
        wrapperId={8888}
        editorState={editorCont}
        // editorClassName={styles.editor}
        wrapperClassName="overflow-scroll border border-gray-300 box-border corner-2-8-8-8"
        onEditorStateChange={handleChangeEditor}
        // onContentStateChange={handleChangeEditor}
        toolbar={editorToolbarOptions}
        placeholder='在此输入正文'
        localization={{
          locale: 'zh',
        }}
      />
      {dom && ReactDom.createPortal(
        <div className="p-16">
          <FileUploader
            fileData={files}
            multiple
            maxFileSize={5}
            uploaderDescription="上传附件"
            onFileSuccess={handleFileSuccessUpload}
            onFileError={(err) => toast.error(err.message)}
            onFileDelete={deleteFiles}
          />
        </div>,
        dom,
      )}
    </div>
  );
}

export default EditorField;

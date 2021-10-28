import React, { useState, useEffect, useRef } from 'react';
import ReactDom from 'react-dom';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { Upload, QxpFile } from '@QCFE/lego-ui';
import { FileInfo as FileListItemInfo } from '@portal/modules/system-mgmt/send-message/filelist';

import toast from '@lib/toast';
import Icon from '@c/icon';

import { FileInfo } from '.';
import Filelist from './filelist';
import editorToolbarOptions from './editor-toolbar';

type FieldValues = {
  content: any;
  files: any[];
}

type FileItem = {
  file_name: string;
  file_url: string;
}

interface Props {
  value?: FieldValues;
  onChange?: (values: FieldValues) => void;
}

function EditorField({ value, onChange }: Props): JSX.Element {
  const uploaderRef = useRef<Upload>(null);
  const [dom, setDom] = useState<Element | null>(null);
  const [files, setFiles] = useState<Array<any>>((value?.files || []).map(
    (itm: FileItem) => ({
      filename: itm.file_name,
      url: itm.file_url,
      status: 'success',
    })));
  const [editorCont, setEditorCont] = useState(value && value.content ?
    EditorState.createWithContent(
      ContentState.createFromBlockArray(
        htmlToDraft(value.content).contentBlocks),
    ) : EditorState.createEmpty());

  useEffect(() => {
    setDom(document.getElementById('rdw-wrapper-8888'));
  }, []);

  const deleteFiles = (currentFile: FileListItemInfo): void => {
    if (currentFile.file_uid) {
      uploaderRef?.current?.abort(currentFile.file_uid);
    }
    const newFiles = filterFiles(files, currentFile);

    setFiles(newFiles);
  };

  function getEditorCont(cont: EditorState, asRaw?: boolean): any {
    const raw = convertToRaw(cont.getCurrentContent());
    return asRaw ? raw : draftToHtml(raw);
  }

  function filterFiles(files: any[], currentFile: FileListItemInfo): any[] {
    let curFiles: FileInfo[];
    if (currentFile.file_uid) {
      curFiles = files.filter((file: FileInfo) => file.uid !== currentFile.file_uid);
    } else {
      curFiles = files.filter((file: FileInfo) => file.filename !== currentFile.file_name);
    }
    return curFiles;
  }

  function addFile(file: FileInfo): void {
    const newFiles = [...files, file];
    setFiles(newFiles);
    onChange && onChange({
      content: getEditorCont(editorCont),
      files: newFiles,
    });
  }

  function updateFile(name: string, data: Partial<FileInfo>): void {
    setFiles((currentFiles) => {
      const curFile = currentFiles.find((f) => f.filename === name);
      Object.assign(curFile, data);
      onChange && onChange({
        content: getEditorCont(editorCont),
        files: [...currentFiles],
      });
      return [...currentFiles];
    });
  }

  function handleChangeEditor(editorState: EditorState): void {
    setEditorCont(editorState);
    onChange && onChange({
      content: getEditorCont(editorState),
      files,
    });
  }

  function handleFileSuccessUpload(res: any, file: QxpFile): void {
    const { uid } = file;
    if (res.code === 200) {
      updateFile(res.data.filename, {
        uid,
        filename: res.data.filename,
        url: res.data.url,
        percentage: 100,
        status: 'success',
        showProgress: false,
      });
    } else {
      toast.error('上传失败');
    }
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
          <Filelist
            candownload
            deleteFiles={deleteFiles}
            files={(files || []).map((itm) => ({
              file_uid: itm.uid,
              file_url: itm.url,
              file_name: itm.filename,
              percent: itm.percentage,
              showProgress: itm.showProgress,
              status: itm.status,
            }))}
          />
          <Upload
            ref={uploaderRef}
            headers={{ 'X-Proxy': 'API' }}
            multiple
            action="/api/v1/fileserver/uploadFile"
            beforeUpload={(file) => {
              if (file.size > 1024 * 1024 * 5) {
                toast.error('文件大小不能超过5wweM');
                return false;
              }
              if (files.find((f) => f.filename === file.name)) {
                toast.error('文件已存在，请勿重复上传');
                return false;
              }
              return true;
            }}
            onStart={(file) => {
              addFile({
                uid: file.uid,
                filename: file.name,
                url: '',
                percentage: 0,
                showProgress: true,
                status: 'active',
              });
            }}
            onProgress={(step, file) => {
              const percent = typeof step.percent === 'number' ? Math.round(step.percent) : 0;
              updateFile(file.name, {
                percentage: percent,
                showProgress: true,
              });
            }}
            onSuccess={handleFileSuccessUpload}
            onError={(err) => toast.error(err.message)}
          >
            <div className='flex items-center cursor-pointer'>
              <Icon name="attachment" className="mr-4" />
              <div>上传附件</div>
            </div>
          </Upload>
        </div>,
        dom,
      )}
    </div>
  );
}

export default EditorField;

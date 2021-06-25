import React, { forwardRef, useState, useImperativeHandle, useEffect } from 'react';
import { Message, Upload } from '@QCFE/lego-ui';

import Icon from '@c/icon';
import Filelist, { FileInfo } from '@c/filelist';

import styles from './index.module.scss';

interface Props {
  showFiles?: (files: Array<FileInfo>) => void,
  addSend?: JSX.Element,
}

const FileUpload = forwardRef((props: Props, ref:any) => {
  const [files, setFiles] = useState<Array<FileInfo>>(([]).map((itm: FileInfo) => ({
    filename: itm.filename,
    url: itm.url,
    status: 'success',
  })));
  useImperativeHandle(ref, () => ({
    emptyFiles: () => setFiles(files.slice(0, 0)),
  }));
  useEffect(
    ()=>{
      if (props.showFiles) props.showFiles(files);
    }, [files],
  );
  const addFile = (file: FileInfo) => setFiles((currentFiles) => ([...currentFiles, file]));
  const updateFile = (name: string, data: Partial<FileInfo>)=> {
    setFiles((currentFiles) => {
      const curFile = currentFiles.find((f) => f.filename === name);
      Object.assign(curFile, data);
      return [...currentFiles];
    });
  };

  // @ts-ignore
  const handleFileSuccessUpload = (res) => {
    if (res.code == 200) {
      updateFile(res.data.filename, {
        filename: res.data.filename,
        url: res.data.url,
        percentage: 100,
        status: 'success',
        showProgress: false,
      });
      Message.success('上传成功');
    } else {
      Message.warning('上传失败');
    }
  };
  const deleteFiles = (name: string) => {
    setFiles((curFiles) => curFiles.filter((file) => file.filename !== name ));
  };

  return (
    <>
      <div className="flex flex-col">
        <Filelist files={files} canDownload={true} deleteFiles={deleteFiles} hideProgress={true}/>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <Upload
            headers={{ 'X-Proxy': 'API' }}
            multiple
            action="/api/v1/fileserver/uploadFile"
            beforeUpload={(file)=> {
              if (file.size > 1024 * 1024 * 5) {
                Message.error('文件大小不能超过5M');
                return false;
              }
              if (files.find((f) => f.filename === file.name)) {
                Message.warning('文件已存在，请勿重复上传');
                return false;
              }
              return true;
            }}
            onStart={(file)=> {
              addFile({
                filename: file.name,
                url: '',
                percentage: 0,
                showProgress: true,
                status: 'active',
              });
            }}
            onProgress={(step, file)=> {
              // @ts-ignore
              const percent = typeof step.percent === 'number' ? Math.round(step.percent) : 0;
              updateFile(file.name, {
                percentage: percent,
                showProgress: true,
              });
            }}
            onSuccess={handleFileSuccessUpload}
            onError={(err)=> Message.error(err.message)}
          >
            <div className={`${styles.upload} flex align-center`}>
              <Icon name="attachment" />
            </div>
          </Upload>
        </div>
        {props.addSend}
      </div>
    </>
  );
});
export default FileUpload;

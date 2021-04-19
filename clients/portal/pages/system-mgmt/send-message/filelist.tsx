import React from 'react';
import styles from './index.module.scss';
import Icon from '@c/icon';
import {Progress} from '@QCFE/lego-ui';

interface FileInfo {
  file_url: string;
  file_name: string;
  percent?: number;
  showProgress?: boolean;
  status?: 'success' | 'exception' | 'active';
}

const Filelist = ({files, candownload, deleteFiles, hideProgress}: { deleteFiles?: (key: number) => void, files: Array<FileInfo>, candownload?: boolean, hideProgress?: boolean }) => {
  return (
    <div className={styles.fileList}>
      {files.map((itm, idx) => (
        <div className={styles.file_itm} key={idx}>
          {candownload ? <a href={itm.file_url}>{itm.file_name}</a> : <span>{itm.file_name}</span>}
          {!hideProgress && <Progress
            className='mr-40 relative -top-2'
            percent={itm.percent}
            status={itm.status}
            key={itm.file_url}
            // onIconClick={() => {
            //   this.uploader.resend(fileId);
            // }}
          />}
          {deleteFiles ? <Icon onClick={() => deleteFiles(idx)} name="close" clickable/> : null}
        </div>
      ))}
    </div>);
};

export default Filelist;

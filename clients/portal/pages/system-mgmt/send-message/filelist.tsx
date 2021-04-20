import React from 'react';
import styles from './index.module.scss';
import Icon from '@c/icon';
import { Progress } from '@QCFE/lego-ui';
import { saveAs } from 'file-saver';

interface FileInfo {
  file_url: string;
  file_name: string;
  percent?: number;
  showProgress?: boolean;
  status?: 'success' | 'exception' | 'active';
}

const Filelist = ({ files, candownload, deleteFiles, hideProgress }: { deleteFiles?: (name: string) => void, files: Array<FileInfo>, candownload?: boolean, hideProgress?: boolean }) => {
  const handleDownload=(link: string, filename: string)=> {
    saveAs(link, filename);
  };

  return (
    <div className={styles.fileList}>
      {files.map((itm, idx) => (
        <div className={styles.file_itm} key={idx}>
          {candownload ?
            (<span className='cursor-pointer'
              onClick={() => handleDownload(itm.file_url, itm.file_name)}>{itm.file_name}</span>) :
            <span>{itm.file_name}</span>}
          {!hideProgress && (<Progress
            className='mr-40'
            percent={itm.percent}
            status={itm.status}
            key={itm.file_url}
            // onIconClick={() => {
            //   this.uploader.resend(fileId);
            // }}
          />)}
          {deleteFiles ? <Icon onClick={() => deleteFiles(itm.file_name)} name="close" clickable/> : null}
        </div>
      ))}
    </div>);
};

export default Filelist;

import React from 'react';
import styles from './index.module.scss';
import Icon from '@c/icon';
interface FileInfo {
  file_url: string
  file_name: string
}

const Filelist = ({ files, candownload, deleteFiles }: { deleteFiles?: (key: number) => void, files: Array<FileInfo>, candownload?: boolean }) => {
  return (<div className={styles.fileList}>
    {files.map((itm, idx) => (<div className={styles.file_itm} key={idx}>
      {candownload ? <a href={itm.file_url}>{itm.file_name}</a> : <span>{itm.file_name}</span>}
      {deleteFiles ? <Icon onClick={()=>deleteFiles(idx)} name="close" /> : null}
    </div>))}
  </div>);
};

export default Filelist;

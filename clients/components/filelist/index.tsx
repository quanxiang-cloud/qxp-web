import React from 'react';
import cs from 'classnames';
import { saveAs } from 'file-saver';
import jsZip from 'jszip';
import { Progress, Message } from '@QCFE/lego-ui';

import Icon from '@c/icon';

import styles from './index.module.scss';

export interface FileInfo {
  url: string;
  filename: string;
  percentage?: number;
  showProgress?: boolean;
  status?: 'success' | 'exception' | 'active';
}

interface Props {
  deleteFiles?: (name: string) => void;
  files: Array<FileInfo>;
  canDownload?: boolean;
  hideProgress?: boolean;
  isPreview?: boolean;
  canMultiDownload?: boolean;
  messageTitle?: string;
}

const regImage = /jpe?g|png|gif|svg/i;

const isImageExt = (filename: string): boolean => {
  const parts = filename.split('.');
  const name = parts[parts.length - 1];
  return regImage.test(name);
};

const Filelist = ({
  files,
  canDownload,
  canMultiDownload,
  deleteFiles,
  hideProgress,
  isPreview,
  messageTitle,
}: Props) => {
  const handleDownload = (link: string, filename: string) => {
    if (!canDownload) {
      return;
    }
    saveAs(link, filename);
  };

  const dlViaBlob = (url: string)=> {
    return fetch(url)
      .then((res) => ({ url, blob: res.blob() }))
      .catch((err: Error) => Message.error(err.message));
  };

  const exportZip = (blobs: Array<{ url: string, blob: any }>) => {
    const zip = jsZip();
    blobs.forEach(({ url, blob }) => {
      const urlInst = new URL(url);
      const urlPath = urlInst.pathname.split('/');
      zip.file(decodeURIComponent(urlPath[urlPath.length - 1]), blob);
    });
    zip.generateAsync({
      type: 'blob',
      platform: 'UNIX',
    }).then((zipFile) => {
      return saveAs(zipFile, `消息附件打包-${messageTitle || Date.now()}.zip`);
    });
  };

  const dlAndZip = (urls: string[]) => {
    // @ts-ignore
    return Promise.all(urls.map((url) => dlViaBlob(url))).then(exportZip);
  };

  const handleZipDl = () => {
    dlAndZip(files.map((file) => file.url));
  };

  const renderList = () => {
    return (
      <>
        {files.map((itm, idx) => (
          <div className={styles.file_itm} style={{ background: '#F0F6FF' }} key={idx}>
            <span
              onClick={() => handleDownload(itm.url, itm.filename)}
              className={cs('inline-flex items-center', {
                'cursor-pointer': 'candownload',
              })}
            >
              <span className={cs(styles.typeFile, { [styles.typeImage]: isImageExt(itm.filename) })}/>
              {itm.filename}
            </span>
            {!hideProgress && (
              <Progress
                className='mr-40'
                percent={itm.percentage}
                status={itm.status}
                key={itm.url}
              />
            )}
            {deleteFiles && (<Icon onClick={() => deleteFiles(itm.filename)} name="restore_from_trash" clickable/>)}
          </div>
        ))}
      </>
    );
  };

  if (!files.length) {
    return null;
  }

  return (
    <div className={styles.fileList}>
      {isPreview ? (
        <fieldset>
          <legend>
            附件
            {canMultiDownload &&
            (<span className='cursor-pointer ml-8 text-12 text-blue-600' onClick={handleZipDl}>
              打包下载
            </span>)}
          </legend>
          {renderList()}
        </fieldset>
      ) : renderList()}
    </div>
  );
};

export default Filelist;

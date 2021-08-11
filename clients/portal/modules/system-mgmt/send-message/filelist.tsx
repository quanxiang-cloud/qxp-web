import React from 'react';
import { Progress, Message } from '@QCFE/lego-ui';

import Icon from '@c/icon';
import cs from 'classnames';
import jsZip from 'jszip';
import { saveAs } from 'file-saver';

import styles from './index.module.scss';

export type FileInfo = {
  file_uid?: string;
  file_url: string;
  file_name: string;
  percent?: number;
  showProgress?: boolean;
  status?: 'success' | 'exception' | 'active';
}

export interface FileListProps {
  deleteFiles?: (file: FileInfo) => void;
  files: Array<FileInfo>;
  candownload?: boolean;
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
  candownload,
  canMultiDownload,
  deleteFiles,
  hideProgress,
  isPreview,
  messageTitle,
}: FileListProps): JSX.Element | null => {
  const handleDownload = (link: string, filename: string): void => {
    if (!candownload) {
      return;
    }
    if (isImageExt(filename)) {
      window.open(link, '_blank');
      return;
    }
    saveAs(link, filename);
  };

  const dlViaBlob = (url: string): Promise<Response> => {
    return fetch(url)
      .then((res) => ({ url, blob: res.blob() }))
      .catch((err: Error) => Message.error(err.message));
  };

  const exportZip = (blobs: Array<{ url: string, blob: any }>): void => {
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
      return saveAs(zipFile, `附件打包-${messageTitle || Date.now()}.zip`);
    });
  };

  const dlAndZip = (urls: string[]): Promise<void> => {
    return Promise.all(urls.map((url) => dlViaBlob(url))).then(exportZip);
  };

  const handleZipDl = (): void => {
    dlAndZip(files.map((file) => file.file_url));
  };

  const renderList = (): JSX.Element => {
    return (
      <>
        {files.map((itm, idx) => (
          <div className={styles.file_itm} key={idx}>
            <span
              onClick={(): void => handleDownload(itm.file_url, itm.file_name)}
              className={cs('inline-flex items-center', {
                'cursor-pointer': 'candownload',
              })}
            >
              <span className={cs(styles.typeFile, { [styles.typeImage]: isImageExt(itm.file_name) })}/>
              {itm.file_name}
            </span>
            {!hideProgress && (
              <Progress
                className='mr-40'
                percent={itm.percent}
                status={itm.status}
                key={itm.file_url}
              />
            )}
            {deleteFiles && (
              <Icon onClick={(): void => deleteFiles(itm)} name="delete" clickable/>
            )}
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

import { observable, action } from 'mobx';

import toast from '@lib/toast';
import httpClient from '@lib/http-client';
import { uniqueId } from 'lodash';

import Md5Worker from 'web-worker:../utils/md5-worker';
import smallFileUploadRequest from './small-file-upload-stream';
import bigFileMultipartUpload from './big-file-part-upload-stream';

import {
  CHUNK_SIZE,
  FILE_DELETE_API,
  BIG_FILE_SIGN_API,
  FILE_STORE_OPTION,
  SMALL_FILE_SIGN_API,
  MAX_SMALL_FILE_SIZE,
  ABORT_MULTIPART_API,
} from '../constants';

export type FileStoreProps = {
  files: QXPUploadFileBaseProps[],
  onSuccess?: (file: QXPUploadFileTask) => void,
  onError?: (err: Error, file: QXPUploadFileTask) => void,
}

class FileStore {
  onSuccess?: (file: QXPUploadFileTask) => void;
  onError?: (err: Error, file: QXPUploadFileTask) => void;
  constructor(props: FileStoreProps) {
    this.files = props.files;
    this.onSuccess = props.onSuccess;
    this.onError = props.onError;
  }

  @observable files: QXPUploadFileTask[];
  @observable fileRequests: Record<string, (() => void) | null> = {}

  @action
  addUploadFile = (fileItem: QXPUploadFileTask): void => {
    this.files.push(fileItem);
  }

  @action
  removeUploadFile = (deleteFile: QXPUploadFileTask): void => {
    this.abortFile(deleteFile);
    if (deleteFile.uploadID && deleteFile.state !== 'success') {
      httpClient(ABORT_MULTIPART_API, {
        path: deleteFile.uid,
        uploadID: deleteFile.uploadID,
      });
    }
    httpClient(FILE_DELETE_API, {
      id: deleteFile.uid,
    });
    this.files = this.files.filter((file) => file.name !== deleteFile.name);
  }

  @action
  getUploadFile = (fileName: string): QXPUploadFileTask | undefined => {
    return this.files.find((file) => file.name === fileName);
  }

  @action
  updateUploadFile = (fileName: string, data: Partial<QXPUploadFileTask>): QXPUploadFileTask => {
    const fileIndex = this.files.findIndex((file) => file.name === fileName);
    this.files[fileIndex] = { ...this.files[fileIndex], ...data };
    return this.files[fileIndex];
  }

  @action
  clearUploadFiles = (): void => {
    this.files = [];
  }

  @action
  prepareFilesUpload = (files: File[]): void => {
    const extendedFiles: QXPUploadFileTask[] = files.map((file: File) => ({
      name: file.name,
      uid: uniqueId('qxp-file'), // Use uuid as a temp uid for key props in file list render, and it will be replaced after file signed
      size: file.size,
      type: file.type || 'application/octet-stream',
      blob: file,
    }));

    extendedFiles.forEach((file) => {
      this.addUploadFile(file);
      this.calcFileMD5(file).then(this.startUploadFile);
    });
  };

  startUploadFile = (fileWithMd5: QXPUploadFileTask): void => {
    this.signFile(fileWithMd5).then((signedFile) => {
      signedFile.isExist ? this.onFileUploadSuccess(signedFile) : this.putFileStream(signedFile);
    }).catch((err) => {
      this.onFileUploadError(err, fileWithMd5);
    });
  }

  calcFileMD5 = (
    file: QXPUploadFileTask,
  ): Promise<QXPUploadFileTask> => {
    return new Promise((resolve, reject) => {
      const { blob } = file;
      const worker = new Md5Worker();
      file.md5Worker = worker;
      worker.postMessage({ blob, CHUNK_SIZE, MAX_SMALL_FILE_SIZE });
      worker.onmessage = (e: MessageEvent<{ percentage: number, md5: string, fileChunks: Blob[] }>) => {
        const { percentage, md5, fileChunks } = e.data;
        if (fileChunks) {
          file.fileChunks = fileChunks.map((chunk: Blob, index: number) => {
            return {
              partNumber: index + 1,
              chunkBlob: chunk,
            };
          });
        }
        if (percentage) {
          file.progress = percentage;
        }
        if (md5) {
          file.md5 = md5;
          resolve(file);
          worker.terminate();
        }
        file.state = 'processing';
        this.updateUploadFile(file.name, file);
        return;
      };
      worker.onerror = (error: ErrorEvent) => {
        reject(error);
      };
    });
  };

  signFile = (file: QXPUploadFileTask): Promise<QXPUploadFileTask> => {
    const { md5 } = file;
    if (!md5) throw new Error('no file md5 provided.');
    const signUrl = file.size >= MAX_SMALL_FILE_SIZE ? BIG_FILE_SIGN_API : SMALL_FILE_SIGN_API;
    this.updateUploadFile(file.name, file);
    return httpClient(signUrl, {
      digest: md5,
      contentType: file.type,
      contentLength: file.size,
      path: `${md5}/${file.name}`,
      option: FILE_STORE_OPTION,
    }).then((response) => {
      const { path, url, exist, uploadID } = response as any;
      const signedFile = this.updateUploadFile(file.name, {
        uid: path,
        uploadID,
        uploadUrl: url,
        isExist: exist,
      });
      return signedFile;
    });
  };

  @action
  putFileStream = (file: QXPUploadFileTask): void => {
    const fileUploadStreamRequest = file.size > MAX_SMALL_FILE_SIZE ?
      bigFileMultipartUpload : smallFileUploadRequest;
    const putFileData = {
      file,
      onSuccess: this.onFileUploadSuccess,
      onProgress: this.onFileUploading,
      onError: this.onFileUploadError,
    };
    this.fileRequests[file.uid] = fileUploadStreamRequest(putFileData);
  };

  @action
  retryUploadFile = (file: QXPUploadFileTask): void => {
    const { name } = file;
    const retryFile = this.getUploadFile(name);
    if (!retryFile) {
      return;
    }
    if (file.isExist === undefined) {
      this.startUploadFile(retryFile);
      return;
    }
    this.putFileStream(retryFile);
  };

  @action
  abortFile = (abortFile?: QXPUploadFileTask): void => {
    if (!abortFile) return;
    abortFile?.md5Worker?.terminate();
    this.fileRequests[abortFile.uid]?.();
  }

  @action
  abortAllFiles = (): void => {
    this.files.forEach((file: QXPUploadFileTask) => {
      if (file.state === 'uploading' || file.state === 'processing') {
        file.md5Worker?.terminate();
        this.fileRequests[file.uid]?.();
      }
    });
  }

  onFileUploadError = (err: Error, file: QXPUploadFileTask): void => {
    file.state = 'failed';
    toast.error(err.message);
    this.updateUploadFile(file.name, file);
    this.onError?.(err, file);
  }

  onFileUploadSuccess = (file: QXPUploadFileTask): void => {
    const { uid, name } = file;
    file.state = 'success';
    file.md5Worker = null;
    file.fileChunks = null;
    this.fileRequests[uid] = null;
    this.updateUploadFile(name, file);
    this.onSuccess?.(file);
  }

  onFileUploading = (file: QXPUploadFileTask, progress: number): void => {
    file.state = 'uploading';
    file.progress = progress;
    this.updateUploadFile(file.name, file);
  }
}

export default FileStore;

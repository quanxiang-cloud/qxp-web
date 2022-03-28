import { NumberString, Props } from '@m/qxp-ui-mobile';
import toast from '@lib/toast';
import httpClient from '@lib/http-client';
import { FILE_DOWNLOAD_INFO_API } from '@c/file-upload/constants';

export interface FileListProps extends Props {
  files: QXPUploadFileTask[];
  fileNameClassName?: string;
  leftIconSize?: NumberString;
  rightIcon?: string;
  rightIconClick?: (file: QXPUploadFileTask, index: number) => void;
  canDownload?: boolean;
  retry?: (file: QXPUploadFileTask) => void;
}

export interface FileItemIconProps extends Props {
  file: QXPUploadFileTask;
  size?: NumberString;
}

export interface FileIconInfo {
  file: QXPUploadFileTask;
  icon: string;
  extension: string;
  bgColor: string;
}

export function isValidUrl(url?: string): boolean {
  return (url?.startsWith('http://') || url?.startsWith('https://')) ?? false;
}

export function getFileIcon(file: QXPUploadFileTask): FileIconInfo {
  let { name, uid } = file;
  if (!name) {
    const nameIndex = uid?.lastIndexOf('/');
    if (nameIndex > -1) {
      name = uid.substring(nameIndex + 1);
    }
  }
  let extension = ''; let icon: string; let bgColor: string;

  const index = name?.lastIndexOf('.') || uid?.lastIndexOf('.');
  if (index > -1) {
    extension = name?.substring(index + 1) || uid?.substring(index + 1);
  }
  switch (extension?.toLowerCase()) {
  case 'jpg':
  case 'jpeg':
  case 'png':
  case 'bmp':
  case 'webp':
  case 'svg':
    icon = 'photo';
    bgColor = '#F59E0B';
    break;
  case 'zip':
  case 'text':
  case 'txt':
    icon = 'insert_drive_file';
    bgColor = '#375FF3';
    break;
  default:
    icon = 'insert_drive_file';
    bgColor = '#64748B';
    break;
  }

  return { file, icon, extension, bgColor };
}

export async function getDownloadUrl(file: QXPUploadFileTask): Promise<string | undefined> {
  if (isValidUrl(file.uid)) {
    return file.uid;
  }
  try {
    const res = await httpClient(FILE_DOWNLOAD_INFO_API, { path: file.uid, fileName: file.name });
    const { url } = res as { url: string };
    if (url) return url;
  } catch (e) {
    toast.error(e);
  }
  return undefined;
}

import React from 'react';
import cs from 'classnames';
import { saveAs } from 'file-saver';
import { useSetState } from 'react-use';

import Icon from '@m/qxp-ui-mobile/icon';
import { addUnit } from '@m/qxp-ui-mobile/utils/format/unit';
import toast from '@lib/toast';

import { FileListProps, getDownloadUrl, getFileIcon, isValidUrl } from './utils';

function fileInfoRender(file: QXPUploadFileTask): string {
  const { progress = 0, state } = file;
  if (!state) return '';

  switch (state) {
  case 'failed':
    return '上传失败';
  case 'uploading':
    return `已上传 ${progress}%`;
  case 'processing':
    return `初始化 ${progress}%`;
  }

  return '';
}

export default function FileList(props: FileListProps): JSX.Element {
  const [loading, setLoading] = useSetState<Record<number, boolean>>({});

  function onFileListItemClick(file: QXPUploadFileTask, index: number): void {
    if (file.state === 'failed' && props.retry) {
      props.retry(file);
      return;
    }
    if (file.state !== 'success') return;
    if (!file.uid) {
      toast.error('链接地址为空，无法下载文件');
      return;
    }
    if (isValidUrl(file.uid)) {
      saveAs(file.uid, file.name);
      return;
    }
    setLoading({ [index]: true });
    getDownloadUrl(file).then((url) => {
      setLoading({ [index]: false });
      if (url) {
        saveAs(url, file.name);
      }
    });
  }

  return (
    <>
      {
        props.files.map((item, index) => {
          const { file, icon, bgColor } = getFileIcon(item);
          const iconSize = props.leftIconSize ?? '0.24rem';
          const info = fileInfoRender(item);
          return (
            <div
              className={cs(
                'radius-0-4-4-4 flex items-center',
                props.className,
                {
                  'mt-8': index > 0,
                  pointer: props.canDownload,
                  'mt-10': index < 1,
                  'bg-red-50': item.state === 'failed',
                },
              )}
              style={props.style}
              key={index}
              onClick={props.canDownload ? () => onFileListItemClick(item, index) : undefined}
            >
              <Icon
                name={icon}
                size={iconSize}
                className='ml-8 mr-8 radius-4-0-4-4'
                style={{
                  background: bgColor,
                  padding: `calc((5 / 24) * ${addUnit(iconSize)})`,
                  color: 'white',
                }}
              />
              <div className={cs('flex-1 truncate', props.fileNameClassName)}>
                {file.name}
              </div>
              {(loading[index] || !!info) && (
                <div className={cs('text-placeholder ml-8', { 'text-red-600': item.state === 'failed' })}>
                  {loading[index] ? '加载中' : info}
                </div>
              )}
              {!!props.rightIcon && (
                <Icon
                  name={props.rightIcon}
                  onClick={props.rightIconClick ? (e) => {
                    e.stopPropagation();
                    props.rightIconClick?.(item, index);
                  } : undefined}
                  className={props.rightIconClick ? 'pointer-4' : ''}
                  size='.4rem'
                  style={{ padding: '.08rem' }}
                />
              )}
            </div>
          );
        })
      }
    </>
  );
}

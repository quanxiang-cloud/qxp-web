import React, { useRef } from 'react';
import cs from 'classnames';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import { Progress } from 'antd';
import { useHistory } from 'react-router-dom';

import Icon from '@c/icon';
import httpClient from '@lib/http-client';
import { FILE_DOWNLOAD_INFO_API } from '@c/file-upload/constants';
import toast from '@lib/toast';

interface Props {
  task: Qxp.TaskItem;
  deleteTaskItem: (id: string) => void
}

const IMPORT_TYPE = ['formImport'];
const EXPORT_TYPE = ['formExport', 'formTemplate'];

export function multipledownloadFile(pathArr: { fileName: string, url: string }[]): void {
  pathArr.forEach((path) => {
    httpClient(FILE_DOWNLOAD_INFO_API, { path: path.url, fileName: path.fileName }).then((res: any) => {
      const { url } = res;
      if (!url) throw Error('无法下载该文件');
      downLoad(url);
    }).catch((reason) => {
      toast.error(reason);
    });
  });
}

export function downLoad(url: string): void {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.style.height = '0';
  iframe.src = url;
  document.body.appendChild(iframe);
  setTimeout(() => {
    iframe.remove();
  }, 60000);
}

function TaskItem({ task, deleteTaskItem }: Props): JSX.Element {
  const { title, status, result, createdAt, value, command, ratio, id } = task;
  const refItem = useRef(null);
  const history = useHistory();

  function getIcon(): string {
    if (IMPORT_TYPE.includes(command)) return 'export-icon';
    if (EXPORT_TYPE.includes(command)) return 'import-icon';
    return 'download-ok';
  }

  function onClickItem(command: string): void {
    if (['formImport', 'formTemplate', 'formExport'].includes(command)) {
      history.push(`/apps/${value.appID}?pageID=${value.tableID}`);
    }
  }

  function getState(): JSX.Element {
    if (status === 1) {
      const _ratio = Number((ratio || 0).toFixed(2));
      return ratio > 0 ? <Progress style={{ width: '140px' }} percent={_ratio} /> : (
        <>
          <img src='/dist/images/loading.svg' alt="loading" className="w-16 h-16 mr-8" />
          <div>进行中...</div>
        </>
      );
    }

    return (
      <>
        <Icon
          size={16}
          className='mr-4'
          name={status === 3 ? 'task-err' : 'task-ok'}
          color={status === 3 ? 'red' : 'green'}
        />
        <div className='truncate w-220' title={result.title}>{result.title}</div>
      </>
    );
  }

  return (
    <div
      ref={refItem}
      className='flex items-center px-20 py-12 h-64 cursor-pointer hover:bg-gray-100'
      onClick={() => onClickItem(command)}
    >
      <Icon name={getIcon()} className="mr-8" size={40} />
      <div className="flex-1 flex flex-col justify-start text-12">
        <div className="flex items-center justify-between">
          <div className="text-gray-900 truncate w-220" title={title || '-'} >{title || '-'}</div>
          <div className="text-gray-500 flex">
            {result && result.path && result.path.length && (
              <Icon
                name='download'
                className='mr-8 hover:text-red-600'
                size={16}
                onClick={() => multipledownloadFile(result.path)}
              />
            )}
            {status !== 1 && (
              <Icon
                name='delete'
                className='hover:text-red-600'
                size={16}
                onClick={() => deleteTaskItem(id)}
              />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className={cs('flex items-center ', {
            'text-red-500': status === 3,
            'text-gray-600': status === 2,
          })}>
            {getState()}
          </div>
          <div className="text-gray-400">
            {dayjs(parseInt(String(createdAt * 1000))).format('YYYY-MM-DD')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(TaskItem);

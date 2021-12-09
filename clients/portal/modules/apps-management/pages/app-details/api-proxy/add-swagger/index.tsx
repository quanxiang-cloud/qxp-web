import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import { UnionColumns } from 'react-table';
import { useHistory, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useMutation } from 'react-query';
import { Progress } from 'antd';

import Table from '@c/table';
import Button from '@c/button';
import toast from '@lib/toast';
import { FilePicker } from '@c/file-upload';
import Icon from '@c/icon';

import Header from '../comps/header';
import ParamsSection from '../add-api/params-section';
import store from '../store';
import { useNamespace } from '../hooks';

type ApiItem = {
  name: string;
  method: string;
  path: string;
}

function AddSwagger(): JSX.Element {
  const [apis, setApis] = useState<ApiItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<boolean>(false);
  const [upLoadFail, setUpLoadFail] = useState<boolean>(false);
  const [upLoading, setUpLoading] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(0);
  const history = useHistory();
  const { appID } = useParams<{ appID: string }>();
  const ns = useNamespace();
  const [submitting, setSubmitting] = useState(false);
  const uploadSwaggerMutation = useMutation(store.uploadSwagger, {
    onMutate: () => {
      setSubmitting(true);
    },
    onSuccess: () => {
      toast.success('批量导入成功');
      setTimeout(toListPage, 500);
    },
    onError: (err) => {
      toast.error(err);
    },
    onSettled: () => {
      setSubmitting(false);
    },
  });

  const COLS: UnionColumns<any>[] = [
    {
      Header: 'API 名称',
      id: 'name',
      accessor: 'name',
    },
    {
      Header: '方法',
      id: 'method',
      accessor: 'method',
    },
    {
      Header: '路径',
      id: 'path',
      accessor: 'path',
    },
  ];

  useEffect(() => {
    store.fetchSvc();
  }, []);

  function onSubmit(): void {
    if (file && apis) {
      uploadSwaggerMutation.mutate(file);
    }
  }

  function toListPage(): void {
    history.push(`/apps/details/${appID}/api_proxy?ns=${ns}`);
  }

  function handleFiles(files: File[]): void {
    setApis([]);
    setFileError(false);
    setUpLoadFail(false);
    setPercent(0);
    setFile(files[0]);
    const reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onloadstart = function() {
      setUpLoading(true);
    };
    reader.onprogress = function(ev) {
      setPercent((ev.loaded / ev.total) * 100);
    };
    reader.onload = function(ev) {
      let swaggerJson;
      try {
        swaggerJson = JSON.parse(ev.target?.result as string || '');
      } catch (err) {
        swaggerJson = {};
      }
      const apis = Object.entries(swaggerJson.paths || {}).map(([path, conf]) => {
        return {
          name: Object.values(conf as Record<string, any>)[0].summary || '',
          path,
          method: Object.keys(conf as Record<string, any>)[0],
        };
      });

      if (!apis.length) {
        setFileError(true);
        return;
      }

      setApis(apis);
    };
    reader.onloadend = function() {
      setUpLoading(false);
    };
    reader.onerror = function() {
      setUpLoadFail(true);
    };
  }

  function getFileSize(size: number): string {
    if (size < 1024) {
      return size + '字节';
    } else if (size > 1024 && size < 1048576) {
      return Math.ceil(size / 1024) + 'KB';
    }

    return Math.ceil(size / 1048576) + 'MB';
  }

  function getIconName(): string {
    if (!upLoadFail && upLoading) {
      return 'upload_file';
    }
    if (fileError || upLoadFail) {
      return 'info_outline';
    }
    if (apis.length && !fileError) {
      return 'file_download_done';
    }

    return 'backup';
  }

  function getDescription(): string {
    if (upLoadFail) {
      return '上传失败，请重新上传';
    }
    if (!upLoadFail && upLoading) {
      return '上传中，请稍等';
    }
    if (fileError) {
      return '请上传符合 Swagger2.0 规范的 JSON 文件';
    }
    if (file && apis.length && !fileError) {
      return `${file?.name}\n${getFileSize(file?.size)}`;
    }

    return '点击或拖拽上传文件到该区域，支持 Swagger2.0 数据导入';
  }

  function renderSwaggerUpload(iconName: string, description: string): JSX.Element {
    return (
      <>
        {(apis.length || upLoading) && (
          <Progress percent={percent} showInfo={false} type='line' strokeWidth={4}
            strokeColor={apis.length ? '#16A34A' : '#375FF3'}
            className='upload-progress'
          />
        )}
        {(apis.length || upLoadFail || fileError) && (
          <div
            className='upload-refresh invisible w-full h-full absolute flex justify-center items-center'
          >
            <Button iconName='refresh' className='refresh-button'>
            重新上传
            </Button>
          </div>
        )}
        <div className={cs('w-full h-full absolute inset-0 flex flex-col justify-center items-center')}>
          <Icon className="upload-icon text-gray-600 flex-shrink-0" name={iconName} size={24} />
          <span className="text-12 text-center select-none">{description || '点击或拖拽上传文件'}</span>
        </div>
      </>
    );
  }

  return (
    <>
      <Header name='批量导入'/>
      <div className="w-full h-full px-16 pt-16">
        <FilePicker
          accept='application/json'
          className={cs(
            'swagger-upload w-full h-86',
            'flex flex-col items-center justify-center',
            {
              'swagger-upload-fail': fileError || upLoadFail,
            },
          )}
          onSelectFiles={handleFiles}
        >
          {renderSwaggerUpload(getIconName(), getDescription())}
        </FilePicker>

        {apis.length > 0 && (
          <ParamsSection title='API 列表预览' className='mt-16'>
            <div style={{ height: 'calc(100vh - 368px)' }}
              className='unusual-table-wrap overflow-auto flex w-full mt-8 px-16'>
              <Table
                loading={store.isLoading}
                emptyTips='暂无数据'
                columns={COLS}
                data={apis}
                rowKey='path'
              />
            </div>
            <div className="text-12 text-gray-600 mt-8 ml-28">
              共<span className="mx-4">{apis.length}</span>条数据
            </div>
          </ParamsSection>
        )}
      </div>
      <div className='flex items-center justify-end w-full h-64 bg-gray-100 py-16 px-20'>
        <Button onClick={() => history.goBack()} className='mr-20'>
          取消
        </Button>
        <Button
          modifier='primary'
          onClick={onSubmit}
          forbidden={!apis.length || submitting}
          loading={submitting}
        >
          确认导入
        </Button>
      </div>
    </>
  );
}

export default observer(AddSwagger);

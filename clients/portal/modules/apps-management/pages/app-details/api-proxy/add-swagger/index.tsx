import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import { UnionColumns } from 'react-table';
import { useHistory, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useMutation } from 'react-query';

import Table from '@c/table';
import Button from '@c/button';
import toast from '@lib/toast';
import { FilePicker } from '@c/file-upload';

import Header from '../comps/header';
import ParamsSection from '../add-api/params-section';
import store from '../store';
import { useNamespace } from '../hooks';

interface Props {
  className?: string;
}

type ApiItem={
  name: string;
  method: string;
  path: string;
}

function AddSwagger(props: Props) {
  const [apis, setApis] = useState<ApiItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const history = useHistory();
  const { appID } = useParams<{appID: string}>();
  const ns = useNamespace();
  const [submitting, setSubmitting] = useState(false);
  const uploadSwaggerMutation = useMutation(store.uploadSwagger, {
    onMutate: ()=> {
      setSubmitting(true);
    },
    onSuccess: ()=> {
      toast.success('批量导入成功');
      setTimeout(toListPage, 500);
    },
    onError: (err)=> {
      toast.error(err);
    },
    onSettled: ()=> {
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

  useEffect(()=> {
    store.fetchSvc();
  }, []);

  function onSubmit(): void {
    if (file && apis) {
      uploadSwaggerMutation.mutate(file);
    }
  }

  function toListPage():void {
    history.push(`/apps/details/${appID}/api_proxy?ns=${ns}`);
  }

  function handleFiles(files: File[]): void {
    setFile(files[0]);
    const reader = new FileReader();
    reader.onload = function(ev) {
      let swaggerJson;
      try {
        // @ts-ignore
        swaggerJson = JSON.parse(ev.target?.result || '');
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

      setApis(apis);
    };
    reader.readAsText(files[0]);
  }

  return (
    <>
      <Header name='批量导入' />
      <div className="w-full h-full px-16 py-16 relative">
        <FilePicker
          accept='application/json'
          description='点击或拖拽上传文件到该区域，支持 Swagger2.0 数据导入'
          className={cs(
            'w-full h-86 border rounded-8 border-dashed border-gray-700',
            'flex flex-col items-center justify-center group-hover:border-blue-600',
          )}
          onSelectFiles={handleFiles}
        />

        {apis.length > 0 && (
          <ParamsSection title='API 列表预览' className='mt-16'>
            <Table
              loading={store.isLoading}
              emptyTips='暂无数据'
              columns={COLS}
              data={apis}
              rowKey='name'
            />
          </ParamsSection>
        )}

        <div className='flex items-center justify-end w-full h-64 bg-gray-100 px-20 absolute left-0 bottom-0'>
          <Button onClick={()=> history.goBack()} className='mr-20'>
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
      </div>
    </>
  );
}

export default observer(AddSwagger);

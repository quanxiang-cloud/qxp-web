import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import { UnionColumns } from 'react-table';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';

import { Upload } from '@QCFE/lego-ui';
import Icon from '@c/icon';
import Table from '@c/table';
import Button from '@c/button';
import toast from '@lib/toast';
// import { FilePicker } from '@c/file-upload';

import Header from '../comps/header';
import ParamsSection from '../add-api/params-section';
import store from '../store';

interface Props {
  className?: string;
}

function AddSwagger(props: Props) {
  const [loading, setLoading] = useState(false);
  const [apis, setApis] = useState([]);
  const history = useHistory();

  useEffect(()=> {
    store.fetchSvc();
  }, []);

  function onSubmit(): void {

  }

  // todo
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

  return (
    <>
      <Header name='批量导入' />
      <div className="w-full h-full px-16 py-16 relative">
        {/* <FilePicker*/}
        {/*  accept='application/json'*/}
        {/*  description='点击或拖拽上传文件到该区域，支持 Swagger2.0 数据导入'*/}
        {/*  className={cs(*/}
        {/*    'w-full h-86 border rounded-8 border-dashed border-gray-700',*/}
        {/*    'flex flex-col items-center justify-center group-hover:border-blue-600',*/}
        {/*  )}*/}
        {/*  onSelectFiles={(files)=> {*/}
        {/*    console.log('select files: ', files);*/}
        {/*  }}*/}
        {/* />*/}

        <Upload
          style={{ width: '100%' }}
          headers={{
            'X-Proxy': 'API',
            'Content-Type': 'multipart/form-data',
          }}
          disabled={!store.currentSvcPath}
          action={`/api/v1/polyapi/raw/upload${store.currentSvcPath}`}
          data={(file:File)=> {
            return {
              version: 'v1',
            };
          }}
          accept=".json"
          beforeUpload={(file)=> {
            if (file.type !== 'application/json') {
              toast.error('请上传 swagger 2.0 的json文件');
              return false;
            }
          }}
          onSuccess={(res)=> {
            if (res && res.code !== 0) {
              toast.error(res.msg);
            }
            console.log('upload suc: ', res);
          }}
          onError={(err)=> {
            toast.error(err);
          }}
        >
          <div
            className={cs(
              'w-full h-86 border rounded-8 border-dashed border-gray-700',
              'flex flex-col items-center justify-center group-hover:border-blue-600',
            )}
          >
            <Icon
              size={16}
              name="cloud_upload"
              className="group-hover:text-blue-600"
            />
            <p className="group-hover:text-blue-600">点击或拖拽上传文件到该区域，支持 Swagger2.0 数据导入</p>
          </div>
        </Upload>

        <ParamsSection title='API 列表预览' className='mt-16'>
          <Table
            loading={loading}
            emptyTips='暂无数据'
            columns={COLS}
            data={apis}
            rowKey='name'
          />
        </ParamsSection>

        <div className='flex items-center justify-end w-full h-64 bg-gray-100 px-20 absolute left-0 bottom-0'>
          <Button onClick={()=> history.goBack()} className='mr-20'>
            取消
          </Button>
          <Button modifier='primary' onClick={onSubmit} forbidden={!apis.length}>
            确认导入
          </Button>
        </div>
      </div>
    </>
  );
}

export default observer(AddSwagger);

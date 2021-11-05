import React, { useState } from 'react';
import cs from 'classnames';
import { UnionColumns } from 'react-table';
import { useHistory } from 'react-router-dom';

import { Upload } from '@QCFE/lego-ui';
import Icon from '@c/icon';
import Table from '@c/table';
import Button from '@c/button';

import Header from '../comps/header';
import ParamsSection from '../add-api/params-section';

interface Props {
  className?: string;
}

function AddSwagger(props: Props) {
  const [fileList, setFileList] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [apis, setApis] = useState([]);
  const history = useHistory();

  function onSubmit(): void {

  }

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

  function beforeUpload(): void {

  }

  function deleteFile(idx: number): void {

  }

  return (
    <>
      <Header name='批量导入' />
      <div className="w-full h-full px-16 py-16 relative">
        <Upload
          style={{ width: '100%' }}
          beforeUpload={beforeUpload}
          accept=".json"
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
        <div className="mt-8 flex flex-col">
          {fileList.map((file, index) => {
            return (
              <div
                key={index}
                className="px-8 py-4 cursor-pointer flex
                        items-center justify-between bg-blue-100"
              >
                <div className="flex items-center">
                  <div
                    className="w-16 h-16 bg-blue-600 corner-12-2-12-12
                          flex items-center justify-center mr-8"
                  >
                    <Icon size={12} name="book" type="light" />
                  </div>
                  <span>{file.name}</span>
                </div>
                <Icon
                  size={16}
                  name="restore_from_trash"
                  onClick={() => deleteFile(index)}
                />
              </div>
            );
          })}
        </div>

        <ParamsSection title='API 列表预览'>
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
          <Button modifier='primary' onClick={onSubmit}>
            确认提交
          </Button>
        </div>
      </div>
    </>
  );
}

export default AddSwagger;

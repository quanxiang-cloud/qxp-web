import React from 'react';
import { Cascader } from 'antd';
import { useParams } from 'react-router';

import Icon from '@c/icon';

import { useQueryNameSpaceRawRootPath } from '../../effects/api/namespace';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

const requestOperates = ['+', '-', '*', '/', '()'];

const polyList: Record<string, Array<any>> = {
  Path: [
    {
      title: '姓名',
      id: 'name',
      required: true,
    },
    {
      title: '描述',
      id: 'description',
      required: true,
    },
    {
      title: '编号',
      id: 'uuid',
      required: true,
    },
    {
      title: '时间',
      id: 'time',
      required: true,
    },
    {
      title: '日期',
      id: 'time',
      required: true,
    },
  ],
  Query: [
    {
      title: '删除时间',
      id: 'time',
      required: true,
    },
    {
      title: '修改时间',
      id: 'time',
      required: true,
    },
    {
      title: '创建时间',
      id: 'time',
      required: true,
    },
    {
      title: 'record_date',
      id: '',
      required: true,
    },
    {
      title: '部门',
      id: 'department',
      required: true,
    },
  ],
  Header: [
    {
      title: '姓名',
      id: 'name',
      required: true,
    },
    {
      title: '部门人数',
      id: 'department_members',
      required: true,
    },
    {
      title: '工资',
      id: 'wage',
      required: true,
    },
    {
      title: '职级',
      id: 'rank',
      required: true,
    },
    {
      title: '手机号码',
      id: 'telephone',
      required: true,
    },
  ],
  Body: [
    {
      title: '昵称',
      id: 'name',
      required: false,
    },
    {
      title: '电话号码',
      id: 'telephone',
      required: true,
    },
  ],
  Test: [
    {
      title: '测试',
      id: 'test',
      required: true,
    },
    {
      title: '电话号码',
      id: 'telephone',
      required: true,
    },
  ],
};

function RequestConfigForm(): JSX.Element {
  const { appID } = useParams<{ appID: string }>();
  const { data: namespace } = useQueryNameSpaceRawRootPath(appID);
  const polyParams = Object.entries(polyList);

  return (
    <>
      <div className="px-20 py-12 flex items-center justify-between border-b-1">
        <div className="flex items-center mr-16 flex-1">
          <span>全部API：</span>
          <Cascader
            className="flex-1"
            options={options}
            expandTrigger="hover"
            onChange={(value) => console.log(value)}
          />
        </div>
        <div className="flex items-center justify-between flex-2">
          <span>请求方法：</span>
          <span className="text-green-600 mr-8">POST</span>
          <span>接口路径：</span>
          <span className="mr-8 flex-1 truncate">http://www.qingcloud.com.sdasdasfasfasdasd..</span>
          <span>API标识：</span>
          <span>ap</span>
        </div>
      </div>
      <div className="flex" style={{ height: 'calc(100vh - 160px)' }}>
        <div className="p-12 flex-2 bg-gray-50 overflow-auto config-params-container">
          {polyParams.length && polyParams.map(([type, params]) => {
            return (
              <div key={type} className="my-20">
                <div className="pb-4 text-gray-900">{type}</div>
                <div className="config-param">
                  {params.map(({ title, id, required }, index) => {
                    return (
                      <div key={`${title}_${id}_${index}`} className="flex justify-between">
                        <div className="flex items-center justify-between w-142 p-8">
                          <div className="flex-1 truncate">
                            <span>{title}</span>
                            <span className="mx-4 text-gray-400">{id}</span>
                            {required && <span className="text-red-600">*</span>}
                          </div>
                          <Icon className="ml-8" name="arrow_right_alt" />
                        </div>
                        <div className="flex-1 border-l-1 border-gray-200 p-8"></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex-1 px-12 border-l-1 border-gray-200 flex flex-col">
          <div className="flex items-center py-12">
            <span className="text-12 font-semibold">运算符：</span>
            <div className="flex-1 flex items-center justify-between">
              {requestOperates.map((operate) => {
                return <span key={operate} className="request-op">{operate}</span>;
              })}
            </div>
          </div>
          <div className="pt-12 border-t-1 border-gray-200 flex-1 overflow-auto">DataTree</div>
        </div>
      </div>
    </>
  );
}

export default RequestConfigForm;

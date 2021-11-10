import React from 'react';
import { Cascader } from 'antd';
import { useQueryNameSpaceRawRootPath } from '../../effects/api/namespace';
import { useParams } from 'react-router';
import { useGetRequestNodeApiList } from '../../effects/api/poly';

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
  path: [],
  query: [],
  Header: [],
  Body: [],
};

function RequestConfigForm(): JSX.Element {
  const { appID } = useParams<{ appID: string }>();
  const { data: namespace } = useQueryNameSpaceRawRootPath(appID);
  const { data } = useGetRequestNodeApiList({ path: namespace?.appPath || '', body: { appID: appID } });

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
      <div className="flex" style={{ height: 'calc(100% - 56px)' }}>
        <div className="p-12 flex-2 bg-gray-50">
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
          <div className="pt-12 border-t-1 border-gray-200 flex-1">DataTree</div>
        </div>
      </div>
    </>
  );
}

export default RequestConfigForm;

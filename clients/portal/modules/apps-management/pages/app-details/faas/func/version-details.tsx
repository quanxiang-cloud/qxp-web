import React, { Suspense, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Prism from 'prismjs';
import 'prismjs/plugins/custom-class/prism-custom-class.js';
import 'prismjs/components/prism-python.js';
import { Input } from 'antd';

import Icon from '@c/icon';

import Tab from '@c/tab';
import PopConfirm from '@c/pop-confirm';

import store from '../store';

import Loading from '@c/loading';

const { TextArea } = Input;
function VersionDetails(): JSX.Element {
  useEffect(() => {
    Prism.highlightAll();
    Prism.plugins.customClass.map({
      number: 'pr-number',
    });
  });
  const [tabNow, setTabNow] = useState((store.buildIsError));
  const [des, setDes] = useState(store.currentVersionFunc.describe);
  const tabItems = [
    {
      id: 'build',
      name: '构建过程',
      content: (
        <>
          <div className='h-full'>
            1111111111
          </div>
        </>
      ),
    },
    {
      id: 'create',
      name: 'API文档',
      // content: renderApiDetails(),
      content: <div className='h-full'>
        <Suspense fallback={<Loading />}>
          <div className='api-content-title'>请求示例</div>
          <div className='api-content'>
            <pre className='api-details'>
              {/* <code className={`language-${store.docType === 'curl' ? 'bash' : store.docType}`}> */}
              <code className='language-js'>
                console.log(111)
                {/* {`${store.APiContent.output}`} */}
              </code>
            </pre>
          </div>
          <div className='api-content-title mt-16'>返回示例</div>
          <pre className='api-details'>
          console.log(111)
            {/* <code className={`language-${store.docType === 'curl' ? 'bash' : store.docType}`}> */}
            <code className='language-js'>
              {/* {`${store.APiContent.output}`} */}
            </code>
          </pre>
        </Suspense>
      </div>,
    },
  ];
  function onClick(): void {
    store.modalType = 'funDetail';
  }
  return (
    <div className='flex flex-col flex-1 h-full px-20 version-detail'>
      <div className='flex items-center justify-between h-48'>
        <div className='flex'>
          <div
            onClick={onClick}
            className='text-gray-600 text-14 corner-8-8-8-2 cursor-pointer hover:bg-gray-100'>
            <Icon
              clickable
              changeable
              size={20}
              name='keyboard_backspace'
            />
            <span className="">返回</span>
          </div>
          <div className='mx-8'>/</div>
          <div className='text-gray-900 font-semibold mr-16'>版本号：v0.1</div>
          <div className='text-red-600 border flex items-center'>
            <Icon
              name='status'
              size={8}
            // className='text-blue-1000'
            />
            <div className='text-12 text-gray-900 pl-10'>失败</div>
          </div>
        </div>
        <a
          href={`//${window.CONFIG.docs_hostname}`}
          target="_blank"
          rel="noreferrer"
          className="app-header-icon corner-4-0-4-4 text-white"
        >
          <Icon name="help_doc" size={21} style={{ fill: 'var(--gray-400)' }} className='m-6'/>
        </a>
      </div>
      <div className='grid gap-x-16 grid-flow-row-dense grid-cols-4'>
        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>版本号：</div>
          <div className='text-gray-900 flex-1  '>{store.currentVersionFunc.tag}</div>
        </div>
        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>构建时间：</div>
          <div className='text-gray-900 flex-1 card-value'>xxxx</div>
        </div>
        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>创建人：</div>
          <div className='text-gray-900 flex-1 card-value'>{store.currentVersionFunc.creator}</div>
        </div>
        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>创建时间：</div>
          <div className='text-gray-900 flex-1 card-value'>{store.currentVersionFunc.createAt}</div>
        </div>
        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>最后更新人：</div>
          <div className='text-gray-900 flex-1 card-value'>{store.currentVersionFunc.updatedAt}</div>
        </div>
        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>最后更新时间：</div>
          <div className='text-gray-900 flex-1 card-value'>{store.currentVersionFunc.updatedAt}</div>
        </div>

        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>描述：</div>
          <div className='text-gray-900 flex-1 card-value'>
            {store.currentVersionFunc.describe}
            <PopConfirm
              content={(
                <div
                  className="flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-body2 text-gray-600 mb-8">描述</div>
                  <TextArea
                    name="name"
                    defaultValue={des}
                    maxLength={30}
                    className="description-input"
                    onChange={(e) => setDes(e.target.value)}
                  />
                </div>
              )}
              okText="保存"
              onOk={() => store.updateVerDesc(des)}
            >
              <Icon clickable name='edit' className="ml-4 cursor-pointer"/>
            </PopConfirm>
          </div>

        </div>
      </div>
      <Tab
        items={tabItems}
        className='w-full h-full opacity-95'
      />
    </div>
  );
}

export default observer(VersionDetails);

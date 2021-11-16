import React, { Suspense, useEffect } from 'react';
import { setValidationLanguage } from '@formily/antd';
import { observer } from 'mobx-react';
import Prism from 'prismjs';
import 'prismjs/plugins/custom-class/prism-custom-class.js';
import 'prismjs/components/prism-python.js';

import Icon from '@c/icon';
import store from '../store';
import Tab from '@c/tab';
import { useState } from 'react';

setValidationLanguage('zh');

import Loading from '@c/loading';

function VersionDetails(): JSX.Element {
  useEffect(() => {
    Prism.highlightAll();
    Prism.plugins.customClass.map({
      number: 'pr-number',
    });
  });
  const [tabNow, setTabNow] = useState((store.buildIsError));
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
    store.modalType = '';
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
          <div className='text-gray-900 flex-1  '>v01</div>
        </div>
        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>版本号：</div>
          <div className='text-gray-900 flex-1 card-value'>v01</div>
        </div>
        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>版本号：</div>
          <div className='text-gray-900 flex-1 card-value'>v01</div>
        </div>
        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>版本号：</div>
          <div className='text-gray-900 flex-1 card-value'>v01</div>
        </div>
        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>版本号：</div>
          <div className='text-gray-900 flex-1 card-value'>v01</div>
        </div>
        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>版本号：</div>
          <div className='text-gray-900 flex-1 card-value'>v01</div>
        </div>
        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>版本号：</div>
          <div className='text-gray-900 flex-1 card-value'>v01</div>
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

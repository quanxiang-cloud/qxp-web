import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Prism from 'prismjs';
import { Input } from 'antd';
import 'prismjs/plugins/custom-class/prism-custom-class.js';

import Tab from '@c/tab';
import Icon from '@c/icon';
import Loading from '@c/loading';
import Tooltip from '@c/tooltip';
import PopConfirm from '@c/pop-confirm';

import store from '../store';

import '../index.scss';
import '../../api-documentation/prism.css';

const { TextArea } = Input;

function renderApiDetails(): JSX.Element {
  useEffect(() => {
    store.getApiPath();
  }, []);

  useEffect(() => {
    Prism.highlightAll();
    Prism.plugins.customClass.map({
      number: 'pr-number',
    });
  });

  if (store.isAPILoading) {
    return <Loading/>;
  }

  return (
    <>
      {(
        <>
          <div className='api-content-title'>请求示例</div>
          <div className='api-content'>
            <Tooltip
              position="top"
              label="复制"
              wrapperClassName="copy-button icon-text-btn"
              labelClassName="whitespace-nowrap"
            >
              <Icon
                name="content_copy"
                size={20}
                className='text-inherit'
              />
            </Tooltip>
            <pre className='api-details'>
              <code className='language-bash'>
                {store.APiContent.input}
                console.log(qqqqqqqq)
              </code>
            </pre>
          </div>
          <div className='api-content-title'>返回示例</div>
          <pre className='api-details'>
            <code className='language-bash'>
              {store.APiContent.output}
            </code>
          </pre>

        </>
      )}
    </>

  );
}
function VersionDetails(): JSX.Element {
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
      id: 'apidoc',
      name: 'API文档',
      content: renderApiDetails(),
    },
  ];

  return (
    <div className='flex flex-col flex-1 h-full px-20 version-detail'>
      <div className='flex items-center justify-between h-48'>
        <div className='flex'>
          <div
            onClick={() => store.modalType = 'funDetail'}
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
        onChange={(v) => {
          if (v === 'apidoc') {
            store.getApiPath();
          }
        }}
      />
    </div>
  );
}

export default observer(VersionDetails);

import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Input } from 'antd';
import 'prismjs/plugins/custom-class/prism-custom-class.js';

import Tab from '@c/tab';
import Icon from '@c/icon';
import PopConfirm from '@c/pop-confirm';
import dayjs from 'dayjs';

import store from '../store';
import VersionStatus from '../component/version-status';
import ApiDetails from '../../api-documentation/api-details';
// import BuildProcess from './build-process';

import '../index.scss';
import '../../api-documentation/prism.css';

const { TextArea } = Input;

function VersionDetails(): JSX.Element {
  const {
    state,
    id,
    tag,
    creator,
    createdAt,
    updatedAt,
    describe,
    serverState,
    message,
    visibility,
  } = store.currentVersionFunc;
  const [des, setDes] = useState(describe);
  const tabItems = [
    {
      id: 'build',
      name: '构建过程',
      content: (
        <>
          <div className='h-full'>
            {/* <BuildProcess /> */}
          </div>
        </>
      ),
    },
    {
      id: 'apidoc',
      name: 'API文档',
      content: <ApiDetails apiPath={store.apiPath} />,
    },
  ];

  useEffect(() => {
    store.getVersion();
  }, [store.buildID]);

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
          <VersionStatus
            state={store.currentVersionFunc?.state || 'Unknown'}
            versionID={id}
            message={message}
            visibility={visibility}
            serverState={serverState}
          />
        </div>
        <a
          href={`//${window.CONFIG.docs_hostname}`}
          target="_blank"
          rel="noreferrer"
          className="app-header-icon corner-4-0-4-4 text-white"
        >
          <Icon name="help_doc" size={21} style={{ fill: 'var(--gray-400)' }} className='m-6' />
        </a>
      </div>
      <div className='grid gap-x-16 grid-flow-row-dense grid-cols-4'>
        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>版本号：</div>
          <div className='text-gray-900 flex-1  '>{tag}</div>
        </div>
        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>构建时间：</div>
          <div className='text-gray-900 flex-1 card-value'>
            {`${(updatedAt - createdAt) / 1000} s`}
          </div>
        </div>
        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>创建人：</div>
          <div className='text-gray-900 flex-1 card-value'>{creator}</div>
        </div>
        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>创建时间：</div>
          <div className='text-gray-900 flex-1 card-value'>
            {createdAt ? dayjs(parseInt(String(createdAt * 1000))).format('YYYY-MM-DD HH:mm:ss') : '—'}
          </div>
        </div>
        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>最后更新人：</div>
          <div className='text-gray-900 flex-1 card-value'>{creator}</div>
        </div>
        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>最后更新时间：</div>
          <div className='text-gray-900 flex-1 card-value'>
            {updatedAt ? dayjs(parseInt(String(updatedAt * 1000))).format('YYYY-MM-DD HH:mm:ss') : '—'}
          </div>
        </div>

        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>描述：</div>
          <div className='text-gray-900 flex-1 card-value'>
            {describe}
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
              <Icon clickable name='edit' className="ml-4 cursor-pointer" />
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

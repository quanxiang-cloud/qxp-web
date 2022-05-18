import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { Input } from 'antd';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import 'prismjs/plugins/custom-class/prism-custom-class.js';

import Tab from '@c/tab';
import Icon from '@c/icon';
import PopConfirm from '@c/pop-confirm';
import Loading from '@c/loading';
import ws from '@lib/push';

import VersionStatus from '../component/version-status';
import ApiDetails from '../../api-documentation/api-details';
import BuildProcess from './build-process';
import store from './store';
import '../../api-documentation/prism.css';
import { API_DOC_STATE } from '../constants';
import { wsSubscribe } from '../api';

import '../index.scss';

const { TextArea } = Input;

function VersionDetails(): JSX.Element {
  const history = useHistory();
  const [des, setDes] = useState(store.currentBuild?.describe || '');

  const apiDoc = useMemo(() => {
    if (store.currentBuild?.docStatus === API_DOC_STATE.NULL) {
      return (<div>未注册API文档</div>);
    }
    if (store.currentBuild?.docStatus === API_DOC_STATE.REGISTERING) {
      return <Loading desc='文档正在生成中' />;
    }
    if (store.isAPILoading) {
      return (<Loading />);
    }
    return (<ApiDetails apiPath={store.apiPath} />);
  }, [store.isAPILoading, store.currentBuild?.docStatus]);

  useEffect(() => {
    if (store.currentBuild?.docStatus === API_DOC_STATE.REGISTERING) {
      wsSubscribe({
        topic: 'register',
        key: store.currentBuild.id,
        uuid: ws.uuid,
      });
      ws.addEventListener(
        'faas',
        'doc-build',
        (data) => store.apiDocStateChangeListener(data, store.currentBuild?.id));
    }

    if (store.currentBuild?.docStatus && store.currentBuild?.docStatus > API_DOC_STATE.REGISTERING) {
      ws.removeEventListener('faas', 'doc-build');
    }
    return () => {
      ws.removeEventListener('faas', 'doc-build');
    };
  }, [store.currentBuild?.docStatus]);

  const tabItems = [
    {
      id: 'build',
      name: '构建过程',
      content: (
        <>
          <div className='h-full'>
            <BuildProcess />
          </div>
        </>
      ),
    },
    {
      id: 'apidoc',
      name: 'API文档',
      content: apiDoc,
    },
  ];

  useEffect(() => {
    store.getVersion();
    return () => {
      store.currentBuild = null;
    };
  }, [store.buildID]);

  if (!store.currentBuild) {
    return <div>Loading...</div>;
  }

  const {
    version,
    creator,
    createdAt,
    updatedAt,
    describe,
    message,
    updater,
    status,
    builtAt,
  } = store.currentBuild;

  function onGoBack(e: MouseEvent): void {
    e.stopPropagation();
    history.goBack();
  }
  return (
    <div className='flex flex-col flex-1 h-full px-20 version-detail'>
      <div className='flex items-center justify-between h-48'>
        <div className='flex'>
          <div
            onClick={onGoBack}
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
          <div className='text-gray-900 font-semibold mr-16'>版本号：{version}</div>
          <VersionStatus
            state={store.currentBuild?.status || 0}
            versionID={store.buildID}
            message={message}
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
          <div className='text-gray-900 flex-1  '>{version}</div>
        </div>
        <div className='flex text-12 p-8 items-center '>
          <div className='text-gray-600'>构建时间：</div>
          <div className='text-gray-900 flex-1 card-value'>
            {builtAt ? `${((builtAt - createdAt) / (60 * 1000)).toFixed(2)} min` : '-'}
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
          <div className='text-gray-900 flex-1 card-value'>{updater}</div>
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
                  <div className="text-gray-600 mb-8">描述</div>
                  <TextArea
                    name="name"
                    defaultValue={des}
                    maxLength={100}
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
        className='w-full h-full opacity-95 api-tab'
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

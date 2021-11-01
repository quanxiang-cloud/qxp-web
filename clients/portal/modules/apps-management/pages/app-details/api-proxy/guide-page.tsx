import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useHistory } from 'react-router-dom';

import Button from '@c/button';
import Modal from '@c/modal';
import toast from '@lib/toast';

import FormAddGroup from './side-nav/form-add-group';
import store from './store';
import { useNamespace } from './hooks';

import './styles.scss';

interface Props {
  className?: string;
}

type GuideStepItem = {
  title: string;
  desc: string;
  link: string;
  divider?: boolean;
  step?: number;
}

const guideSteps: GuideStepItem[] = [
  {
    title: '配置分组、密钥',
    desc: '创建分组后，需要为分组绑定对应的域名。如需鉴权请配置密钥。',
    link: '#',
    divider: true,
  },
  {
    title: '配置分组、密钥',
    desc: '创建分组后，需要为分组绑定对应的域名。如需鉴权请配置密钥。',
    link: '#',
    divider: true,
  },
  {
    title: '新建API、批量导入',
    desc: '支持手动新建，或通过导入Swagger2.0 文件批量创建 API。',
    link: '#',
  },
];

function GuideItem({ title, desc, link, divider, step = 0 }: GuideStepItem) {
  return (
    <div className='guide-item'>
      <div className='guide-item-caption'>
        <span className='guide-item-idx'>{step}</span>
        <span className='guide-item-txt text-h6-no-color-weight'>{title}</span>
        {divider && <span className='guide-item-divider'/>}
      </div>
      <p className='guide-item-desc'>
        {desc}
        {link && <a href={link} rel='noreferrer noopener'>查看文档</a>}
      </p>
    </div>
  );
}

function GuidePage(props: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const formInst = useForm();
  const { appID } = useParams<{appID: string}>();
  const ns = useNamespace();
  const history = useHistory();

  function handleAddGroup(): void {
    formInst.handleSubmit(async (data: any) => {
      try {
        await store.createNs(store.appRootNs, data);
        await store.fetchNamespaces(store.appId);
      } catch (err) {
        toast.error(err);
      }
    })();
  }

  useEffect(()=> {
    // fix stale query string
    if (ns) {
      history.push(`/apps/details/${appID}/api_proxy`);
    }
  }, []);

  return (
    <div className='bg-white mt-20 mx-20 guide-page h-full overflow-hidden'>
      <div className='guide-page--header px-32 py-20'>
        <h2 className='text-gray-600 text-h5-no-color mb-8'>第三方 API 代理</h2>
        <p className='text-gray-400 text-caption-no-color'>
          您可以通过全象云平台，实现注册/调用第三方 API 。基于全象云平台的透明代理、安全认证机制，实现了对用户隐藏第三方 API 的安全认证、协议差异等诸多异构特性。
          <a href='#' rel='noreferrer noopener' className='text-blue-600'>查看文档</a>
        </p>
      </div>
      <div className='guide-page--body'>
        <div className='empty-api-group mb-8'/>
        <p className='text-gray-400 text-caption-no-color'>暂无数据。您可以点击新建分组</p>
        <p className='text-gray-400 text-caption-no-color'>通过分组注册、调用、管理所需的第三方 API</p>
        <div className='btn-groups mt-16'>
          <Button iconName='help_outline' className='mr-20'>操作指南</Button>
          <Button iconName='create_new_folder' modifier='primary' onClick={()=> setModalOpen(true)}>新建分组</Button>
        </div>
      </div>
      <div className='guide-page--footer px-32 py-20'>
        <h2 className='text-gray-600 text-h5-no-color mb-20'>使用指引</h2>
        <div className='guide-steps'>
          {guideSteps.map((v, idx) => <GuideItem {...v} key={idx} step={idx + 1}/>)}
        </div>
      </div>
      {modalOpen && (
        <Modal
          title='新建分组'
          onClose={() => setModalOpen(false)}
          footerBtns={[
            { key: 'cancel', text: '取消', iconName: 'close', onClick: () => setModalOpen(false) },
            { key: 'confirm', text: '确认新建', iconName: 'check', onClick: handleAddGroup, modifier: 'primary' },
          ]}
        >
          <FormAddGroup form={formInst} onSubmit={handleAddGroup} />
        </Modal>
      )}
    </div>
  );
}

export default GuidePage;

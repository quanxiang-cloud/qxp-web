import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { UnionColumn } from 'react-table';
import { Form, Input } from 'antd';
import { FormInstance } from 'antd/es/form';
import { observer } from 'mobx-react';
import cs from 'classnames';

import Card from '@c/card';
import Button from '@c/button';
import { getBatchGlobalConfig } from '@lib/api/user-config';
import Table from '@c/table';
import EmptyTips from '@c/empty-tips';
import Modal, { FooterBtnProps } from '@c/modal';
import toast from '@lib/toast';
import Loading from '@c/loading';

import Orchestrator from '../view-orchestration/orchestrator';
import { genDesktopRootViewSchemaKey } from '../view-orchestration/helpers/utils';
import { VERSION } from '../view-orchestration/constants';
import { Layout } from '../view-orchestration/types';
import AppLayoutType from '../../entry/app-list/app-layout-select';

import './index.scss';

enum LayoutType {
  HeaderContent = 'header-content',
  LeftSidebarContent = 'left-sidebar-content',
  RightSidebarContent = 'right-sidebar-content',
}

const initLayout: Layout = {
  id: '', name: '', type: LayoutType.HeaderContent, description: '', subViews: [], refSchemaID: '',
};

function PageLayout(): JSX.Element {
  const [store, setStore] = useState<Orchestrator>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [type, setType] = useState<LayoutType>();
  const [curLayoutMsg, setCurLayoutMsg] = useState<Layout>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isTypeValidate, setIsTypeValidate] = useState<boolean>(true);
  const fromRef = useRef<FormInstance>(null);
  const { appID } = useParams<{ appID: string }>();
  const rootSchemaKey = genDesktopRootViewSchemaKey(appID);
  const param = { key: rootSchemaKey, version: VERSION };
  const { data, isLoading } = useQuery(['rootSchema', param], () => getBatchGlobalConfig([param]));

  useEffect(() => {
    if (data) {
      setStore(new Orchestrator(appID, JSON.parse(data?.result[rootSchemaKey])));
    }
  }, [data]);

  function handleSubmit(): void {
    const values: { name: string, description: string} = fromRef.current?.getFieldsValue();
    fromRef.current?.submit();
    if (!values.name) {
      return;
    }
    if (!isEdit && !type) {
      setIsTypeValidate(false);
      return;
    } else if (!isEdit && type) {
      store?.addLayout(values.name, type).then(() => setShowModal(false)).catch((err) => toast.error(err));
    }

    isEdit && curLayoutMsg && store?.editLayout(curLayoutMsg?.id, values.name).then(
      () => setShowModal(false),
    ).catch((err) => toast.error(err));
  }

  function renderLayoutType(layoutType: LayoutType): JSX.Element {
    return (
      <div
        className={cs('flex-1 h-92 w-152 flex justify-center gap-4 cursor-pointer', {
          'flex-col': layoutType === LayoutType.HeaderContent,
          'flex-row-reverse': layoutType === LayoutType.RightSidebarContent,
        })}
      >
        <div className='flex-1 bg-gray-200' />
        <div className='flex-5 bg-gray-200' />
      </div>
    );
  }

  const columns: UnionColumn<Layout>[] = [
    {
      Header: '页面布局',
      id: 'name',
      width: 'auto',
      accessor: 'name',
    },
    {
      Header: '样式',
      id: 'type',
      width: 'auto',
      accessor: ({ type }: Layout) => renderLayoutType(type),
    },
    {
      Header: '页面描述',
      id: 'description',
      width: 'auto',
      accessor: 'description',
    },
    {
      Header: '关联页面',
      id: 'subViews',
      width: 'auto',
      accessor: 'subViews',
    },
    {
      Header: '操作',
      id: 'action',
      width: 'auto',
      accessor: (layout: Layout) => {
        return (
          <div className='flex'>
            <span
              className='text-btn mr-16'
              onClick={() => {
                setIsEdit(true);
                setCurLayoutMsg(layout);
                setShowModal(true);
              }}
            >
              编辑
            </span>
            <span
              className='text-btn mr-16'
              onClick={() => store?.deleteViewOrLayout(layout.id)}
            >
              删除
            </span>
            <span
              className='text-btn mr-16'
              onClick={() =>{
                // todo
              }}
            >
              去设计
            </span>
          </div>
        );
      },
    },
  ];
  const btnList: FooterBtnProps[] = [
    {
      text: '取消',
      key: 'cancel',
      iconName: 'close',
      onClick: () => setShowModal(false),
    },
    {
      text: '提交',
      key: 'confirm',
      iconName: 'check',
      modifier: 'primary',
      onClick: () => handleSubmit(),
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="border rounded-8">
      <Card
        className="h-full transition-opacity flex flex-col flex-1 mt-0"
        headerClassName="px-20 py-16 h-48 nav-card-header"
        title="页面布局"
        itemTitleClassName="text-h6"
        desc='页面布局可共享使用在多个页面中，在创建页面时，可以选择一个布局作为基础'
        descClassName="text-caption"
      >
        <div className='mx-20 my-20 bg-white rounded-12'>
          <Button className='mb-20' onClick={() => {
            setIsEdit(false);
            setShowModal(true);
            setCurLayoutMsg(initLayout);
          }}>
            新增
          </Button>
          <Table
            emptyTips={<EmptyTips text='暂无页面布局' className="pt-40" />}
            rowKey='id'
            columns={columns}
            data={store?.layouts || []}
          />
        </div>
      </Card>
      {showModal && (
        <Modal
          title={`${isEdit ? '修改' : '新增'}页面布局`}
          onClose={() => setShowModal(false)}
          footerBtns={btnList}
        >
          <div className='px-20 pt-24'>
            <Form layout='vertical' ref={fromRef}>
              <Form.Item
                label='布局名称'
                name='name'
                initialValue={curLayoutMsg?.name}
                rules={[{ required: true, message: '请输入布局名称' }]}
              >
                <Input />
              </Form.Item>
              {!isEdit && (
                <AppLayoutType
                  title='样式'
                  includeFree={false}
                  className='app-layout-type'
                  onSelect={(layoutType) => {
                    layoutType && setIsTypeValidate(true);
                    setType(layoutType as LayoutType);
                  }}
                />
              )}
              {!isTypeValidate && <span className='text-red-600'>请输入布局样式</span>}
              <Form.Item
                label='描述'
                name='description'
                initialValue={curLayoutMsg?.description}
              >
                <Input.TextArea />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default observer(PageLayout);

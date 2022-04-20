import React, { useRef, useState } from 'react';
import { UnionColumn } from 'react-table';
import { Form, Input } from 'antd';
import { FormInstance } from 'antd/es/form';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import Card from '@c/card';
import Button from '@c/button';
import Table from '@c/table';
import EmptyTips from '@c/empty-tips';
import Modal, { FooterBtnProps } from '@c/modal';
import toast from '@lib/toast';
import Loading from '@c/loading';

import { Layout, LayoutType } from '../types.d';
import useAppStore from '../hooks';
import ViewLayoutSelector from '../../../entry/app-list/layout-select/view-layout-selector';

import './index.scss';

type LayoutProps = {
  name: string,
  description: string,
  layoutType: LayoutType
}

const initLayout: Layout = {
  id: '', name: '', type: LayoutType.HeaderContent, description: '', subViews: [], refSchemaID: '',
};

function ViewLayout(): JSX.Element {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [curLayoutMsg, setCurLayoutMsg] = useState<Layout>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const fromRef = useRef<FormInstance>(null);
  const { store, isLoading } = useAppStore();
  const history = useHistory();

  function handleSubmit(): void {
    const values: LayoutProps = fromRef.current?.getFieldsValue();

    fromRef.current?.submit();
    if (!values.name) {
      return;
    }

    Promise.resolve().then(() => {
      setPending(true);
      if (!isEdit) {
        return store?.addLayout(values.name, values.layoutType);
      }
      if (curLayoutMsg) {
        return store?.editLayout(curLayoutMsg?.id, values.name);
      }
    }).then(() => setShowModal(false)).catch((err) => {
      toast.error(err);
    }).finally(() => {
      setPending(false);
    });
  }

  const columns: UnionColumn<Layout>[] = [
    {
      Header: '页面布局',
      id: 'name',
      width: 'auto',
      accessor: 'name',
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
      accessor: ({ subViews }) => subViews.length,
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
              onClick={() => {
                history.push(`/artery-engine?appID=${store?.appID}&pageName=${layout.name}&arteryID=${layout.refSchemaID}`);
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
      loading: pending,
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
            data={store?.layouts.filter((layout) => layout.id !== 'root_node') || []}
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
                <Input placeholder='请输入布局名称' maxLength={20} />
              </Form.Item>
              {!isEdit && (
                <Form.Item
                  label='母版布局'
                  name='layoutType'
                  required
                  initialValue={LayoutType.HeaderContent}
                >
                  <ViewLayoutSelector />
                </Form.Item>
              )}
              <Form.Item
                label='描述'
                name='description'
                initialValue={curLayoutMsg?.description}
              >
                <Input.TextArea maxLength={100} placeholder='选填（100个字符以内）' />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default observer(ViewLayout);

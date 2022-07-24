import React, { useMemo, useRef, useState } from 'react';
import { UnionColumn } from 'react-table';
import { Form, Input } from 'antd';
import { FormInstance } from 'antd/es/form';
import { observer } from 'mobx-react';
import { useHistory, useLocation } from 'react-router-dom';

import Card from '@c/card';
import Button from '@c/button';
import Table from '@c/table';
import EmptyTips from '@c/empty-tips';
import Modal, { FooterBtnProps } from '@c/modal';
import toast from '@lib/toast';
import Loading from '@c/loading';
import MoreMenu, { MenuItem } from '@c/more-menu';
import { Icon } from '@one-for-all/ui';

import { Layout, LayoutType } from '../types.d';
import { CreateLayoutInfo } from '../helpers/add-layout-to-root';
import appStore from '../../store';
import ViewLayoutSelector from '../../../entry/app-list/layout-select/view-layout-selector';
import { VIEW_TYPE_MAP } from '../constants';

const initLayout: Layout = {
  id: '', name: '', type: LayoutType.HeaderContent, description: '', subViews: [], refSchemaID: '',
};

function ViewLayout(): JSX.Element {
  const history = useHistory();
  const { state } = useLocation<{openCreateModal: boolean}>();
  const { viewStore } = appStore;
  const [showModal, setShowModal] = useState<boolean>(state?.openCreateModal || false);
  const [pending, setPending] = useState<boolean>(false);
  const [curLayout, setCurLayout] = useState<Layout>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const allLayoutNames = useMemo(() => viewStore?.layouts.map((layout) => layout.name), [viewStore?.layouts] ) || [];

  const excludeLayoutNames = useMemo(() => {
    if (isEdit) {
      return viewStore?.layouts.filter((layout) => layout.name !== curLayout?.name)
        .map((layout) => layout.name);
    }
  }, [isEdit, viewStore?.layouts, curLayout]) || [];

  const fromRef = useRef<FormInstance>(null);

  function validateRepeat(name: string): boolean {
    if (isEdit) {
      return excludeLayoutNames.includes(name);
    }
    return allLayoutNames.includes(name);
  }

  function handleSubmit(): void {
    fromRef.current?.submit();
  }

  function handleFinish(_values: CreateLayoutInfo): void {
    const name = _values.name.trim();
    const description = _values?.description?.trim() || '';
    const values = { ..._values, name, description };
    Promise.resolve().then(() => {
      setPending(true);
      if (!isEdit) {
        return viewStore?.addLayout(values);
      }
      if (curLayout) {
        return viewStore?.editLayout({ ...curLayout, ...values });
      }
    }).then(() => {
      setShowModal(false);
      toast.success('修改成功');
    }).catch((err) => {
      toast.error(err);
    }).finally(() => {
      setPending(false);
    });
  }

  const LayoutActions: MenuItem<string>[] = [
    {
      key: 'copy',
      label: (
        <div className="flex items-center">
          <Icon name="content_copy" size={16} className="mr-8" />
          <span className="font-normal">复制母版</span>
        </div>
      ),
    },
    {
      key: 'delete',
      label: (
        <div className="flex items-center">
          <Icon name="delete" size={16} className="mr-8" />
          <span className="font-normal">删除</span>
        </div>
      ),
    },
  ];

  const columns: UnionColumn<Layout>[] = [
    {
      Header: '名称',
      id: 'name',
      width: 'auto',
      accessor: 'name',
    },
    {
      Header: '布局类型',
      id: 'type',
      width: '80px',
      accessor: ({ type }) => {
        return VIEW_TYPE_MAP[type];
      },
    },
    {
      Header: '关联页面',
      id: 'subViews',
      width: 'auto',
      accessor: ({ subViews }) => {
        if (!subViews.length) return '-';
        return subViews.map((view) => view.name).join('、');
      },
    },
    {
      Header: '页面描述',
      id: 'description',
      width: 'auto',
      accessor: 'description',
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
                setCurLayout(layout);
                setShowModal(true);
              }}
            >
              修改
            </span>
            <span
              className='text-btn mr-16'
              onClick={() => {
                history.push(`/artery-engine?appID=${viewStore?.appID}&pageName=${layout.name}&arteryID=${layout.refSchemaID}`);
              }}
            >
              去设计
            </span>
            <MoreMenu
              menus={LayoutActions}
              placement="bottom-end"
              onMenuClick={(key): void => {
                if (key === 'copy') {
                  viewStore?.copyLayout(layout);
                  return;
                }
                if (key === 'delete') {
                  const canDelete = !layout.subViews.length;
                  const modal = Modal.open({
                    title: '提示',
                    content: (
                      <div className='flex flex-col gap-8 px-40 py-24'>
                        <div className='flex items-center gap-8 text-yellow-600'>
                          <Icon name='error_outline' size={20}/>
                          <span className='text-h6-bold font-semibold'>
                            {canDelete ? '确认要删除该母版吗？' : '无法删除：该母版存在关联页面'}
                          </span>
                        </div>
                        <span className='text-body2 pl-28'>
                          {canDelete ? '删除母版后，所有数据将无法找回' : '若要删除该母版，请先删除母版关联的页面'}
                        </span>
                      </div>
                    ),
                    onConfirm: () => {
                      canDelete && viewStore?.deleteViewOrLayout(layout.id).then(() => {
                        toast.success('删除成功');
                      });
                      modal.close();
                    },
                    confirmModifier: canDelete ? 'danger' : 'primary',
                    confirmText: canDelete ? '确认删除' : '确认',
                  });
                  return;
                }
              }}

            />
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
      onClick: handleSubmit,
    },
  ];

  if (appStore.loading) {
    return <Loading />;
  }

  return (
    <>
      <Card
        className="h-full transition-opacity flex flex-col flex-1 mt-0"
        headerClassName="px-20 py-16 h-48 nav-card-header bg-gray-50 header-background-image rounded-t-8"
        title="母版管理"
        itemTitleClassName="text-caption-no-color-weight font-semibold"
        desc='可自定义设计版式，为应用内其他页面共用，拥有一次设计多处复用的特性'
        descClassName="text-caption"
      >
        <div className='mx-20 my-20 bg-white rounded-12'>
          <Button
            className='mb-20'
            iconName='add'
            modifier='primary'
            onClick={() => {
              setIsEdit(false);
              setShowModal(true);
              setCurLayout(initLayout);
            }}>
            新增母版
          </Button>
          <div style={{ height: 'calc(100vh - 200px)' }} >
            <Table
              emptyTips={<EmptyTips text='暂无页面布局' className="pt-40" />}
              rowKey='id'
              columns={columns}
              data={viewStore?.layouts.filter((layout) => layout.id !== 'root_node') || []}
            />
          </div>
        </div>
      </Card>
      {showModal && (
        <Modal
          title={`${isEdit ? '修改' : '新增'}页面布局`}
          onClose={() => setShowModal(false)}
          footerBtns={btnList}
        >
          <div className='px-20 pt-24'>
            <Form
              layout='vertical'
              ref={fromRef}
              onFinish={handleFinish}
            >
              <Form.Item
                label='布局名称'
                name='name'
                required
                initialValue={curLayout?.name || ''}
                extra={(<span className='text-12 pt-4'>最多 20 个字符，支持中文、英文、下划线、数字。母版名称不可重复</span>)}
                rules={[
                  {
                    type: 'string',
                    max: 20,
                    message: '名称不超过 20 字符，请修改！ ',
                  },
                  {
                    validator: (_, value) => {
                      if (!value.trim()) {
                        return Promise.reject(new Error('布局名称不能为空'));
                      }
                      if (validateRepeat(value)) {
                        return Promise.reject(new Error('母版名称重复'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder='请输入布局名称' maxLength={20} />
              </Form.Item>
              {!isEdit && (
                <Form.Item
                  label='母版布局'
                  name='type'
                  required
                  initialValue={LayoutType.HeaderContent}
                >
                  <ViewLayoutSelector />
                </Form.Item>
              )}
              <Form.Item
                label='描述'
                name='description'
                initialValue={curLayout?.description}
                rules={[
                  {
                    type: 'string',
                    max: 100,
                    message: '描述不可超过 100 字符',
                  },
                ]}
              >
                <Input.TextArea maxLength={100} placeholder='选填（100个字符以内）' />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      )}
    </>
  );
}

export default observer(ViewLayout);

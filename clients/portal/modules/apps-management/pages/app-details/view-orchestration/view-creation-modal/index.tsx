import React, { useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Form, Input } from 'antd';

import { Icon, Modal, Select } from '@one-for-all/ui';

import ViewTypeSelector from './view-type-selector';
import StaticViewUpload from '../static-view-upload';
import { URL_PARAM_LIST } from '../constants';

import { BaseView, CreateViewParams, ExternalView, Layout, View, ViewGroup, ViewType } from '../types.d';
import toast from '@lib/toast';

export type Props = {
  onCancel: () => void;
  onSubmit: (viewInfo: CreateViewParams<View>) => void;
  layouts: Layout[];
  views: Array<View | ViewGroup>;
  modalType: string;
  viewParams?: View;
}

const { Item } = Form;

function CreateViewModal(
  { viewParams, onCancel, onSubmit, views, layouts, modalType }: Props,
): JSX.Element {
  const [_viewType, _setViewType] = useState<ViewType>();
  const [viewType, setViewType] = useState<ViewType | undefined>(viewParams?.type);
  const { appID } = useParams<{ appID: string }>();
  const history = useHistory();

  const [form] = Form.useForm();
  const isCreateView = modalType === 'createView';

  const allViewNames = useMemo(() => views.map((view) => (view as BaseView).name), [views]);

  const excludeViewNames = useMemo(() => {
    if (modalType === 'editView') {
      return views.filter((view) => view.name !== viewParams?.name)
        .map((view) => view.name);
    }
  }, [modalType, views]) || [];

  const layoutOptions = useMemo(() => [{ label: '无布局（默认）', value: '' }].concat(layouts.map((layout) => ({
    label: layout.name,
    value: layout.id,
  }))), [layouts]);

  function validateRepeat(name: string): boolean {
    if (!isCreateView && viewParams?.name) {
      return excludeViewNames.includes(name);
    }
    return allViewNames.includes(name) && isCreateView;
  }

  function onViewTypeSubmit(): void {
    if (!_viewType) {
      toast.error('请选择页面类型');
      return;
    }
    setViewType(_viewType);
  }

  function handleSubmit(): void {
    if (!viewType) {
      onViewTypeSubmit();
      return;
    }
    form.submit();
  }

  function handleFinish(values: any): void {
    onSubmit({ ...(viewParams || {}), ...values, type: viewType });
  }

  function handleBack(): void {
    if (viewType && isCreateView) {
      setViewType(undefined);
      return;
    }
    onCancel();
  }

  function modalTitleRender(): string {
    if (modalType === 'editView') return '修改页面';
    return viewType ? '新建页面' : '选择页面类型';
  }

  function submitBtnTextRender(): string {
    if (modalType === 'editView') return '提交修改';
    return viewType ? '创建页面' : '下一步';
  }

  function cancelBtnTextRender(): string {
    if (modalType === 'editView') return '取消';
    return viewType ? '上一步' : '取消';
  }

  return (
    <Modal
      title={modalTitleRender()}
      onClose={onCancel}
      footerBtns={[{
        key: 'close',
        onClick: handleBack,
        text: cancelBtnTextRender(),
      }, {
        key: 'check',
        modifier: 'primary',
        onClick: handleSubmit,
        text: submitBtnTextRender(),
      }]}
    >
      {
        (!viewType && isCreateView) ?
          (<ViewTypeSelector currentSelectType={_viewType} onSelect={_setViewType} />) : (
            <Form
              className="p-20"
              layout='vertical'
              form={form}
              onFinish={handleFinish}
              initialValues={{
                name: viewParams?.name || '',
              }}
            >
              <Item
                name="name"
                label="页面名称"
                extra={(<span className='text-12 pt-4'>不超过 30 个字符，页面名称不可重复。</span>)}
                required
                rules={[
                  {
                    type: 'string',
                    max: 30,
                    message: '名称不超过 30 字符，请修改！ ',
                  },
                  {
                    validator: (_, value) => {
                      if (!value.trim()) {
                        return Promise.reject(new Error('页面名称不能为空'));
                      }
                      if (validateRepeat(value)) {
                        return Promise.reject(new Error('页面名称重复'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder='请输入页面名称' maxLength={30} />
              </Item>
              {
                isCreateView && (<>
                  <Item
                    name='layoutID'
                    tooltip='母版可自定义设计版式，为应用内其他页面共用，拥有一次设计多处复用的特性'
                    label='页面母版'
                    extra={(
                      <span
                        className='inline-flex items-center text-blue-600 pt-4 cursor-pointer text-12'
                        onClick={() => {
                          history.push({
                            pathname: `/apps/details/${appID}/view_layout`,
                            state: { openCreateModal: true },
                          });
                        }}
                      >
                        没有母版？去创建母版
                        <Icon name='keyboard_arrow_right' size={16} />
                      </span>
                    )}
                  >
                    <Select
                      placeholder="无布局（默认）"
                      options={layoutOptions}
                      defaultValue={''}
                    />
                  </Item>
                  {/* <Item
              name="description"
              label="描述"
              rules={[
                {
                  type: 'string',
                  message: '备注超过 100 字符!',
                },
              ]}
            >
              <TextArea placeholder='选填（不超过 100 字符）' />
            </Item> */}
                </>)
              }
              {viewType === ViewType.StaticView && isCreateView && (
                <Item
                  required
                  name="fileUrl"
                  label="上传静态页面"
                >
                  <StaticViewUpload />
                </Item>
              )}
              {viewType === ViewType.ExternalView && ['createView', 'editView'].includes(modalType) && (
                <>
                  <div>所支持的动态参数：</div>
                  <div>
                    {URL_PARAM_LIST?.map((variable) => {
                      return (
                        <span
                          key={variable}
                          className='inline-block mb-8 p-2 bg-gray-100 mr-4 border border-gray-300 cursor-pointe'
                        >
                          {variable}
                        </span>
                      );
                    })}
                  </div>
                  <Item
                    required
                    name="link"
                    label="外部链接地址"
                    initialValue={(viewParams as ExternalView)?.link}
                  >
                    <Input placeholder='请输入链接地址' defaultValue={(viewParams as ExternalView)?.link} />
                  </Item>
                </>
              )}
            </Form>
          )
      }
    </Modal>
  );
}

export default CreateViewModal;

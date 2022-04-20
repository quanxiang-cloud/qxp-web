import React, { useState } from 'react';
import { Form, Input } from 'antd';
import { Modal, Select } from '@one-for-all/ui';

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
  const [form] = Form.useForm();

  const isCreateView = modalType === 'createView';
  const allViewNames = views.map((view) => (view as BaseView).name);
  const layoutOptions = [{ label: '无布局（默认）', value: '' }].concat(layouts.map((layout) => ({
    label: layout.id === 'root_node' ? '应用默认布局' : layout.name,
    value: layout.id,
  })));

  function validateRepeat(value: string): boolean {
    return allViewNames.includes(value) && isCreateView;
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
          (<ViewTypeSelector defaultSelectType={_viewType} onSelect={_setViewType} />) : (
            <Form
              className="p-20"
              layout='vertical'
              form={form}
              onFinish={handleFinish}
              initialValues={{
                name: viewParams?.name,
              }}
            >
              <Item
                name="name"
                label="页面名称"
                extra="不超过 30 个字符，页面名称不可重复。"
                rules={[
                  {
                    required: true,
                    message: '请输入页面名称',
                  }, {
                    type: 'string',
                    message: '名称不超过 30 字符，请修改！ ',
                  }, {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.resolve();
                      } else if (validateRepeat(value)) {
                        return Promise.reject(new Error('页面名称重复'));
                      } else {
                        return Promise.resolve();
                      }
                    },
                  },
                ]}
              >
                <Input placeholder='请输入页面名称' />
              </Item>
              {
                isCreateView && (<>
                  <Item
                    name='layoutID'
                    label="页面布局"
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

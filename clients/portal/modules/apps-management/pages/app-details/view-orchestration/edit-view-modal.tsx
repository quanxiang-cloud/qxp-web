import React, { useState } from 'react';
import { Form, Input } from 'antd';

import Modal from '@c/modal';
import { RadioButtonGroup } from '@one-for-all/ui';
import Select from '@c/select';

import StaticViewUpload from './static-view-upload';

import {
  BaseView,
  CreateViewParams,
  ExternalView,
  Layout,
  View,
  ViewGroup,
  ViewType,
} from '../view-orchestration/types.d';

const { Item } = Form;
// const { TextArea } = Input;

type Props = {
  onCancel: () => void;
  onSubmit: (viewInfo: CreateViewParams<View>) => void;
  layouts: Layout[];
  views: Array<View | ViewGroup>;
  modalType: string;
  viewParams?: View;
};

const URL_PARAM_LIST = [
  '${user_id}',
  '${user_name}',
  '${user_email}',
  '${user_phone}',
  '${dep_id}',
  '${dep_name}',
  '${appid}',
];

const viewTypeMap: LabelValue[] = [
  {
    label: '表单页面',
    value: ViewType.TableSchemaView,
  },
  {
    label: '自定义页面',
    value: ViewType.SchemaView,
  },
  {
    label: '上传静态页面',
    value: ViewType.StaticView,
  },
  {
    label: '外部链接页面',
    value: ViewType.ExternalView,
  },
];

function EditViewModal(
  { viewParams, onCancel, onSubmit, views, layouts, modalType }: Props,
): JSX.Element {
  const [viewType, setViewType] = useState<ViewType>(viewParams?.type || ViewType.TableSchemaView);
  const [form] = Form.useForm();
  const allViewNames = views.map((view) => (view as BaseView).name);
  const layoutOptions = layouts.map((layout) => ({
    label: layout.id === 'root_node' ? '应用默认布局（默认）' : layout.name,
    value: layout.id,
  }));

  function handleSubmit(): void {
    form.submit();
  }

  function handleFinish(values: any): void {
    onSubmit({ ...(viewParams || {}), ...values });
  }

  function validateRepeat(value: string): boolean {
    return allViewNames.includes(value) && modalType === 'createView';
  }

  return (
    <Modal
      title={modalType === 'editView' ? '编辑页面' : '新建页面'}
      onClose={onCancel}
      footerBtns={[{
        key: 'close',
        iconName: 'close',
        onClick: onCancel,
        text: '取消',
      }, {
        key: 'check',
        iconName: 'check',
        modifier: 'primary',
        onClick: handleSubmit,
        text: '确定',
      }]}
    >
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
          modalType === 'createView' && (<>
            <Item
              name='type'
              label="页面类型"
              rules={[
                {
                  required: true,
                  message: '选择页面类型',
                }]}
              initialValue={viewType}
            >
              <RadioButtonGroup
                radioBtnClass="bg-white"
                onChange={(value) => {
                  setViewType(value as ViewType);
                }}
                listData={viewTypeMap}
                currentValue={viewType}
              />
            </Item>
            <Item
              name='layoutID'
              label="页面布局"
            >
              <Select
                placeholder="请选择"
                options={layoutOptions}
                defaultValue={'root_node'}
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
        {viewType === ViewType.StaticView && ['createView'].includes(modalType) && (
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
    </Modal>
  );
}

export default EditViewModal;

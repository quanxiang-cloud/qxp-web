import React, { useState } from 'react';
import { Form, Input } from 'antd';
import { always, cond, T } from 'ramda';

import Modal from '@c/modal';

import SelectField from './select-field';
import { BaseView, CreateViewParams, Layout, View, ViewGroup, ViewType } from '../view-orchestration/types.d';
import { RadioButtonGroup } from '@one-for-all/ui';
import { observer } from 'mobx-react';

const { TextArea } = Input;

type Props = {
  onCancel: () => void;
  onSubmit: (viewParams: CreateViewParams & { layoutType: string}) => void;
  isCopy: boolean;
  layouts: Layout[];
  views: Array<View | ViewGroup>;
  modalType: string;
  viewParams?: CreateViewParams;
};

// type GroupList = {
//   id: string;
//   name: string;
// }

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

function EditPageModal(
  { viewParams, onCancel, onSubmit, isCopy, views, layouts, modalType }: Props,
): JSX.Element {
  const [viewType, setViewType] = useState<ViewType>(ViewType.TableSchemaView);
  const [form] = Form.useForm();
  const [allViewNames, setAllViewNames] = useState(views.map((view) => (view as BaseView).name));

  if (modalType === 'editPage') {
    setAllViewNames(allViewNames.filter((name) => name !== viewParams?.name));
  }

  function handleSubmit(): void {
    form.submit();
  }

  function handleFinish(values: any): void {
    console.log(values);
    onSubmit({ ...(viewParams || {}), ...values });
  }

  function validateRepeat(value: string): boolean {
    return allViewNames.includes(value);
  }

  const { name, layoutID, group, description } = viewParams || {};

  const getTitle = cond([
    [() => isCopy, always('复制页面')],
    [() => modalType === 'editView', always('修改名称与图标')],
    [T, always('新建页面')],
  ]);

  return (
    <Modal
      title={getTitle()}
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
          name: modalType === 'copyPage' ? `${name}-副本` : name,
          description,
          group,
        }}
      >
        <Form.Item
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
        </Form.Item>
        <Form.Item
          name='layoutType'
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
        </Form.Item>
        <Form.Item
          name='layoutID'
          label="页面布局"
        >
          <SelectField
            value={layoutID}
            options={layouts.map((layout) => ({
              label: layout.name,
              value: layout.id,
            }))}
          />
        </Form.Item>
        <Form.Item
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
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default observer(EditPageModal);

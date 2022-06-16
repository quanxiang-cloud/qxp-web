import React, { useMemo, useState } from 'react';
import MoreMenu, { MenuItem } from '@c/more-menu';

import { Form, Input, Select } from 'antd';

import Modal from '@c/modal';
import pageTemplatesStore from '@portal/modules/apps-management/page-templates/store';

import useAppStore from './hooks';
import toast from '@lib/toast';

const { Item } = Form;

const MENUS: MenuItem<string>[] = [{ key: 'create-from-template', label: '基于模版创建' }];

interface FormValue {
  templateKey: string;
  name: string;
  layoutID?: string;
}

function CreateFromTemplate(): JSX.Element {
  const [isShowModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { store: viewOrchestratorStore } = useAppStore();
  const [form] = Form.useForm();
  const templateOptions = pageTemplatesStore.pageTemplates.map(({ key, name }) => ({
    label: name,
    value: key,
  }));

  const layouts = viewOrchestratorStore?.layouts || [];

  const layoutOptions = useMemo(
    () =>
      [{ label: '无布局（默认）', value: '' }].concat(
        layouts
          .filter((layout) => layout.id !== 'root_node')
          .map((layout) => ({
            label: layout.name,
            value: layout.id,
          })),
      ),
    [layouts],
  );

  function onClose(): void {
    setShowModal(false);
  }

  function handleFinish(value: FormValue): void {
    if (!viewOrchestratorStore) {
      return;
    }

    setLoading(true);

    viewOrchestratorStore
      .addPageFromTemplate(value.templateKey, value.name, value.layoutID)
      .then((errorMessage) => {
        setLoading(false);

        if (errorMessage) {
          toast.error(errorMessage);
          return;
        }

        onClose();
      });
  }

  return (
    <>
      <MoreMenu onMenuClick={() => setShowModal(true)} menus={MENUS} />
      {isShowModal && (
        <Modal
          title="基于模版创建页面"
          onClose={onClose}
          footerBtns={[
            {
              key: 'cancel',
              text: '取消',
              onClick: onClose,
            },
            {
              loading,
              key: 'save',
              text: '创建',
              modifier: 'primary',
              onClick: () => form.submit(),
            },
          ]}
        >
          <Form className="p-20" layout="vertical" form={form} onFinish={handleFinish}>
            <Item required name="templateKey" label="请选择模版">
              <Select options={templateOptions} />
            </Item>
            <Item
              name="name"
              label="页面名称"
              extra={<span className="text-12 pt-4">不超过 30 个字符</span>}
              required
              rules={[
                {
                  type: 'string',
                  max: 30,
                  message: '名称不超过 30 字符，请修改！',
                },
                {
                  validator: (_, value) => {
                    if (!value.trim()) {
                      return Promise.reject(new Error('名称不能为空'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder="请输入页面名称" maxLength={30} />
            </Item>
            <Item
              name="layoutID"
              tooltip="母版可自定义设计版式，为应用内其他页面共用，拥有一次设计多处复用的特性"
              label="页面母版"
            >
              <Select placeholder="无布局（默认）" options={layoutOptions} defaultValue={''} />
            </Item>
          </Form>
        </Modal>
      )}
    </>
  );
}

export default CreateFromTemplate;

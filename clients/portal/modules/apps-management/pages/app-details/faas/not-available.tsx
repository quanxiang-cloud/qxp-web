import React, { useState } from 'react';
import { observer } from 'mobx-react';
import SchemaForm, { useForm, FormEffectHooks, createFormActions } from '@formily/antd';
import { Radio, Input } from '@formily/antd-components';

import Button from '@c/button';
import Modal from '@c/modal';
import getRsaKeys from '@lib/generate-ssh-key';
import toast from '@lib/toast';

import store from './store';

const SCHEMA = {
  type: 'object',
  properties: {
    Fields: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        source: {
          type: 'string',
          title: '来源',
          'x-component': 'RadioGroup',
          required: true,
          default: 'custom',
          enum: [
            {
              label: '用户自有的public key',
              value: 'custom',
            },
            {
              label: '生成SSH keys',
              value: 'generate',
            },
          ],
          'x-component-props': {

          },
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 0,
        },
        customPublicKey: {
          type: 'string',
          title: 'public key',
          required: true,
          description: '必须以该账户的邮箱作为KeyName',
          'x-component-props': {
            placeholder: '请输入public key',
          },
          'x-rules': [
            {
              required: true,
              message: '请输入public key',
            },
          ],
          'x-component': 'TextArea',
          'x-index': 1,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
      },
    },
  },
};

const { onFieldValueChange$ } = FormEffectHooks;
const actions = createFormActions();

function NotAvailable(): JSX.Element {
  const [modalVisible, setVisible] = useState(false);
  const { hasGroup, initLoading, initErr } = store;

  const form = useForm({
    actions,
    onSubmit: async (formData) => {
      try {
        if (formData.source === 'custom') {
          await store.createDeveloper(window.USER.email, formData.customPublicKey);
        } else {
          const keys = await getRsaKeys(window.USER.email);
          if (!keys) {
            throw new Error('获取ssh key失败，请重试');
          }

          const a = document.createElement('a');
          a.href = 'data:text/paint; utf-8,' + keys.privateKey;
          a.download = 'faas_private_key';
          a.click();
          await store.createDeveloper(window.USER.email, keys.publicKey);
          toast.success('私钥下载成功');
        }
        store.initFaas();
        setVisible(false);
      } catch (error) {
        toast.error(error);
      }
    },
    effects: ($) => {
      const { setFieldState } = actions;
      onFieldValueChange$('source').subscribe(({ value }) => {
        setFieldState('customPublicKey', (state) => {
          state.visible = value === 'custom';
        });
      });
    },
  });

  function developerCheck(): void {
    store.developerCheck().then((isDeveloper) => {
      if (!isDeveloper) {
        setVisible(true);
        return;
      }

      store.initFaas();
    });
  }

  return (
    <div className="text-12 p-40">
      <p className="text-24 font-semibold">FaaS 函数计算</p>
      <p className="my-20">
        函数计算（Function Compute）是一个事件驱动的全托管 Serverless 计算服务，
        您无需管理服务器等基础设施，只需编写代码并上传，函数计算会为您准备好计算资源，并以弹性、可靠的方式运行您的代码。开通该模块会进行一些初始化程序，大约需要10秒可开通。
        <span className="text-blue-600 cursor-pointer">查看文档</span>
      </p>
      <div className="flex items-center">
        <Button
          className="mr-12"
          textClassName="flex items-center"
          modifier="primary"
          onClick={() => developerCheck()}
        >
          {initLoading && <img src='/dist/images/loading.svg' alt="loading" className="w-16 h-16 mr-8" />}
          {initErr ? '重试' : `${!hasGroup ? '开通 FaaS 函数计算' : '加入 FaaS 函数协作'}`}

        </Button>
        <Button iconName="help_outline">操作指南</Button>
      </div>
      {modalVisible && (
        <Modal
          title='请选择SSH keys来源'
          onClose={() => setVisible(false)}
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              onClick: () => setVisible(false),
            },
            {
              text: '保存',
              key: 'next',
              modifier: 'primary',
              onClick: () => form.submit(),
            },
          ]}
        >
          <SchemaForm
            className="p-20"
            schema={SCHEMA}
            form={form as any}
            components={{ Input, TextArea: Input.TextArea, RadioGroup: Radio.Group }}
          />
        </Modal>
      )}
    </div>
  );
}

export default observer(NotAvailable);

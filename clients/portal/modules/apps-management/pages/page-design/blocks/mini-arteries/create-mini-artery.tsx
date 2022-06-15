import React, { useContext, useState } from 'react';
import { Form, Input } from 'antd';
import cs from 'classnames';
import Icon from '@one-for-all/icon';

import Modal from '@c/modal';

import { ActiveNodeCtx, addMiniArtery } from './utils';
import { MiniArtery } from './types';

const { Item } = Form;

interface Props {
  miniArteries: MiniArtery[];
  onCreate: () => void;
}

function CreateMiniArtery({ miniArteries, onCreate }: Props): JSX.Element {
  const activeNode = useContext(ActiveNodeCtx);
  const [isShowModal, setModalShow] = useState(false);
  const [form] = Form.useForm();

  function validateRepeat(name: string): boolean {
    return !!miniArteries.find((miniArtery) => miniArtery.name === name.trim());
  }

  function handleFinish({ name }: { name: string }): void {
    if (!activeNode) {
      return;
    }

    addMiniArtery(name, activeNode).then(() => {
      onCreate();
      setModalShow(false);
    });
  }

  return (
    <>
      {activeNode && (
        <div className="create-mini-artery">
          <button
            className={cs('create-mini-artery__btn', { disabled: !activeNode })}
            onClick={() => {
              if (!activeNode) {
                return;
              }

              setModalShow(true);
            }}
          >
            <Icon name="post_add" />
            新建区块
          </button>
          <div className="create-mini-artery__desc">将选中的区域保存为模版并在全平台级别使用。</div>
        </div>
      )}
      {activeNode && isShowModal && (
        <Modal
          title="新建区块模版"
          onClose={() => setModalShow(false)}
          footerBtns={[
            {
              key: 'cancel',
              text: '取消',
              onClick: () => setModalShow(false),
            },
            {
              key: 'create',
              text: '新建',
              modifier: 'primary',
              onClick: () => form.submit(),
            },
          ]}
        >
          <Form
            className="p-20"
            layout="vertical"
            form={form}
            initialValues={{ name: `区块-${activeNode.label}` }}
            onFinish={handleFinish}
          >
            <Item
              name="name"
              label="区块名称"
              extra={<span className="text-12 pt-4">不超过 30 个字符，名称不可重复。</span>}
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
                    if (validateRepeat(value)) {
                      return Promise.reject(new Error('名称重复'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder="请输入区块名称" maxLength={30} />
            </Item>
          </Form>
        </Modal>
      )}
    </>
  );
}

export default CreateMiniArtery;

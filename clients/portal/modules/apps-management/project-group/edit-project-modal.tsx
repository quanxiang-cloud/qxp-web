import React, { useEffect, useMemo } from 'react';
import { Input, Form } from 'antd';
import { observer } from 'mobx-react';

import toast from '@lib/toast';
import Modal from '@c/modal';
import Loading from '@c/loading';

import store from './store';
import ButtonField from './button-field';
import { DISABLE_SPECIAL_SYMBOL_REG } from '../pages/entry/app-list/app-edit/created-edit-app';
import { Project, ProjectWithPerson } from './api';

type Props = {
  modalType: string;
  onCancel: () => void;
  project?: Project | undefined;
}

const { TextArea } = Input;

function EditProjectModal({ modalType, project, onCancel }: Props): JSX.Element {
  const [form] = Form.useForm();
  const isEdit = modalType === 'modify';

  useEffect(()=>{
    if (modalType !== 'create') {
      store.getAssociatePerson();
    }
    return ()=> {
      store.setScope([]);
    };
  }, [modalType]);

  const user = useMemo(() => {
    if (store.allScopes.length) {
      const users: UserOrDept[] = [];
      store.allScopes.forEach((scope: ProjectWithPerson) => {
        users.push({
          id: scope.userID,
          ownerID: scope.userID,
          type: 1,
          ownerName: scope.userName,
        });
      });
      return users;
    }
    return [];
  }, [store.allScopes]);

  useEffect(() => {
    form.setFieldsValue({ member: user as EmployeeOrDepartmentOfRole[] });
  }, [user]);

  async function handleSubmit(): Promise<void> {
    const { name, member, description } = form.getFieldsValue();

    const deletes: any[] = user.filter((item: { id: string; }) => {
      return !member.find((m: ProjectWithPerson) => m.id === item.id);
    }).map(({ id }: UserOrDept) => {
      return id;
    });
    const adds: any[] = member.filter((item: ProjectWithPerson) => {
      return !user.find((m: { id: string; }) => m.id === item.id);
    }).map(({ id, ownerName }: EmployeeOrDepartmentOfRole) => {
      return { userID: id, userName: ownerName };
    });

    if (modalType === 'create') {
      store.createProject({ name, description }, { add: adds, removes: deletes }).then(() => {
        onCancel();
      });
      return;
    }

    store.associatePerson( {
      projectID: store?.curProject?.id || '',
      projectName: name,
      add: adds, removes: deletes }).then(() => {
      toast.success('项目修改成功');
      onCancel();
    });
  }

  return (
    <Modal
      title={isEdit ? '修改项目' : '创建项目'}
      onClose={onCancel}
      className="static-modal text-12"
      footerBtns={[
        {
          key: 'close',
          iconName: 'close',
          onClick: onCancel,
          text: '取消',
        },
        {
          key: 'check',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleSubmit,
          text: isEdit ? '确定修改' : '确定保存',
        },
      ]}
    >
      <div className="px-20 py-16 text-12 w-588">
        {store.isFetchPersonalLoading && (
          <Loading desc="加载中..." />
        )}
        {!store.isFetchPersonalLoading && (
          <Form
            layout="vertical"
            form={form}
            initialValues={{
              name: project?.name || '',
              description: project?.description || '',
              member: user as EmployeeOrDepartmentOfRole[],
            }}
          >
            <Form.Item
              name="name"
              label='项目组'
              rules={[
                {
                  required: true,
                  message: '请输入应用名称',
                },
                {
                  pattern: /^((?!(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])).)*$/,
                  message: '不能输入emoji表情符号',
                },
                {
                  type: 'string',
                  max: 30,
                  message: '不能超过 30 个字符',
                },
                {
                  validator: (rule, value) => {
                    if (!value) {
                      return Promise.resolve();
                    } else if (DISABLE_SPECIAL_SYMBOL_REG.test(value)) {
                      return Promise.reject(new Error('不能包含特殊字符'));
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
            >
              <Input placeholder="请输入项目名称" disabled= {isEdit}/>
            </Form.Item>
            <Form.Item
              name="member"
              label="项目组成员"
              rules={[
                { required: true, message: '请选择人员' },
              ]}
            >
              <ButtonField value={user as EmployeeOrDepartmentOfRole[]}/>
            </Form.Item>
            <Form.Item
              name="description"
              label="描述"
              rules={[{ max: 100, message: '输入超过 100 字符' }]}
            >
              <TextArea placeholder="选填(不超过 100 字符)" disabled= {isEdit}/>
            </Form.Item>
          </Form>
        )}

      </div>
    </Modal>
  );
}

export default observer(EditProjectModal);

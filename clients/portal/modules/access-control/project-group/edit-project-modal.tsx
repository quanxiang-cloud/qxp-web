import React, { useEffect, useMemo } from 'react';
import { Input, Form, DatePicker } from 'antd';
import { observer } from 'mobx-react';
import zhCN from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';

import Modal from '@c/modal';
import Loading from '@c/loading';

import store from './store';
import ButtonField from './button-field';
import { DISABLE_SPECIAL_SYMBOL_REG } from '../../apps-management/pages/entry/app-list/app-edit/created-edit-app';
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
    const { name, member, description, startAt, status, endAt, serialNumber } = form.getFieldsValue();
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
    const projectInfo = {
      name,
      description,
      serialNumber,
      status,
      startAt: startAt?.valueOf(),
      endAt: endAt?.valueOf(),
    };
    if (modalType === 'create') {
      store.createProject(projectInfo, { add: adds, removes: deletes }).then(() => {
        onCancel();
      });
      return;
    }

    if (project && modalType === 'modify') {
      store.editProject({ ...project, ...projectInfo }, { add: adds, removes: deletes }).then(() => {
        onCancel();
      });
    }
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
              serialNumber: project?.serialNumber || '',
              status: project?.status || '',
              member: user as EmployeeOrDepartmentOfRole[],
              description: project?.description || '',
              startAt: project?.startAt ? moment(project?.startAt) : null,
              endAt: project?.endAt ? moment(project?.startAt) : undefined,
            }}
          >
            <Form.Item
              name="name"
              label='项目组'
              rules={[
                {
                  required: true,
                  message: '请输入项目名称',
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
              <Input placeholder="请输入项目名称"/>
            </Form.Item>
            <Form.Item
              name="serialNumber"
              label='项目编号'
              rules={[
                {
                  required: true,
                  message: '请输入项目编码',
                },
                {
                  max: 30,
                  message: '项目编码不超过 30 字符，请修改！',
                },
                {
                  pattern: /^[a-zA-Z]+([_]?[a-zA-Z0-9])*$/,
                  message: '必须以字母开头,由字母、数字、单下划线组成',
                },
              ]}
            >
              <Input placeholder="请输入项目编号"/>
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
            <Form.Item name="status" label='状态'>
              <Input placeholder="请输入项目状态"/>
            </Form.Item>
            <Form.Item name='startAt' label="开始日期">
              <DatePicker />
            </Form.Item>
            <Form.Item name='endAt' label="结束日期">
              <DatePicker locale={zhCN}/>
            </Form.Item>
            <Form.Item
              name="description"
              label="描述"
              rules={[{ max: 100, message: '输入超过 100 字符' }]}
            >
              <TextArea placeholder="选填(不超过 100 字符)"/>
            </Form.Item>
          </Form>
        )}

      </div>
    </Modal>
  );
}

export default observer(EditProjectModal);

import React, { JSXElementConstructor, useState } from 'react';
import { useMutation } from 'react-query';
import { Form, FormItem, createFormActions, LifeCycleTypes, IFieldState } from '@formily/antd';
import { Select, Radio, Input, DatePicker } from '@formily/antd-components';

import Modal from '@c/modal';
import toast from '@lib/toast';

import { saveFlowVariable } from '../api';

interface Props {
  variable: ProcessVariable;
  closeModal(): void;
}

const actions = createFormActions();

export default function EditVariableModal({ variable, closeModal }: Props): JSX.Element {
  const [renderComponent, setRenderComponent] = useState<JSXElementConstructor<any>>(() => Input);
  const [defaultDataSource, setDefaultDataSource] = useState<any>();

  const titleText = `${variable.id ? '修改' : '添加'}`;

  const staffMutation = useMutation((values: ProcessVariable) => saveFlowVariable(values), {
    onSuccess: () => {
      toast.success('操作成功');
      closeModal();
    },
    onError: (error: string) => {
      toast.error(error);
    },
  });

  function handleSubmit(): void {
    actions.getFormState((state) => {
      const params: ProcessVariable = {
        flowId: variable.flowId,
        id: variable.id,
        name: state.values.name,
        fieldType: state.values.fieldType,
        defaultValue: state.values.defaultValue,
        type: 'CUSTOM',
      };
      staffMutation.mutate(params);
    });
  }

  return (
    <Modal
      title={`${titleText}变量`}
      onClose={closeModal}
      className="static-modal"
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: closeModal,
        },
        {
          text: `确定${titleText}`,
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleSubmit,
        },
      ]}
    >
      <Form
        actions={actions}
        initialValues={variable}
        onSubmit={handleSubmit}
        effects={($, { setFieldState }) => {
          $(LifeCycleTypes.ON_FIELD_VALUE_CHANGE, 'fieldType').subscribe((fieldTypeState: IFieldState) => {
            setFieldState('defaultValue', (defaultValueState: IFieldState) => {
              const type = fieldTypeState?.value?.toLowerCase();
              if (!type) {
                return;
              }
              const componentMap: Record<string, JSXElementConstructor<any>> = {
                date: DatePicker,
                boolean: Radio.Group,
              };
              if (componentMap[type]) {
                setRenderComponent(() => componentMap[type]);
                setDefaultDataSource([
                  { value: 'False', label: 'false' },
                  { value: 'True', label: 'true' }]);
              } else {
                setRenderComponent(() =>Input);
                setDefaultDataSource(null);
                defaultValueState.props.type = type;
              }
              if (type === variable.fieldType.toLowerCase()) {
                defaultValueState.value = variable.defaultValue;
                return;
              }
              defaultValueState.value = '';
            });
          });
        }}
      >
        <FormItem label="变量名称" name="name" component={Input} rules={[{ required: true, message: '请输入流程变量名称!' }]}/>
        <FormItem
          name="fieldType"
          title="变量类型"
          component={Select}
          rules={[{ required: true, message: '请输入流程变量名称!' }]}
          dataSource={[
            { value: 'TEXT', label: '文本型' },
            { value: 'NUMBER', label: '数值型' },
            { value: 'BOOLEAN', label: '布尔型' },
            { value: 'DATE', label: '日期型' },
          ]}
        />
        <FormItem
          label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值"
          name="defaultValue"
          component={renderComponent}
          dataSource={defaultDataSource}
        />
      </Form>
    </Modal>
  );
}

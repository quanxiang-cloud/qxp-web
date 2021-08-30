import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Steps } from 'antd';
import { SchemaForm, useForm, createAsyncFormActions } from '@formily/antd';
import { Input } from '@formily/antd-components';

import { FooterBtnProps } from '@c/modal';
import Drawer from '@c/drawer';
import Button from '@c/button';
import PageLoading from '@c/page-loading';
import toast from '@lib/toast';

import FieldsDesign from './fields-design';
import store from './store';
import { BASIC_INFO_SCHEMA } from './form-schema';
import { modelCodeCheckRepeat } from './api';

type Props = {
  isEditor: boolean;
  onCancel: () => void;
  onSubmit: (basic: DataModelBasicInfo) => void;
}

const actions = createAsyncFormActions();

function EditorDataModel({ isEditor, onCancel, onSubmit }: Props): JSX.Element {
  const [curStep, setStep] = useState<EditorModelFieldStep>(0);
  const [basicInfo, setBasicInfo] = useState<DataModelBasicInfo>(store.basicInfo);
  const form = useForm({
    onSubmit: setBasicInfo,
    actions,
    initialValues: basicInfo,
  });

  useEffect(() => {
    if (isEditor) {
      actions.setFieldState('tableID', (state) => {
        state.props.readOnly = true;
      });
    }
  }, []);

  const handleNext = async (): Promise<void> => {
    const { values } = await form.submit();
    await new Promise<void>((resolve) => {
      modelCodeCheckRepeat(
        store.appID,
        {
          tableID: values.tableID,
          title: values.title,
          isModify: isEditor,
        }).then(() => {
        resolve();
      }).catch((err) => {
        toast.error(err);
      });
    });

    setStep(1);
  };

  const btnList: FooterBtnProps[] = curStep === 0 ? [
    {
      text: '取消',
      key: 'cancel',
      iconName: 'close',
      onClick: onCancel,
    },
    {
      text: '下一步',
      key: 'next',
      iconName: 'arrow_forward',
      modifier: 'primary',
      onClick: handleNext,
    },
  ] : [
    {
      text: '上一步',
      key: 'back',
      iconName: 'arrow_back',
      onClick: () => setStep(0),
    },
    {
      text: '完成',
      key: 'confirm',
      iconName: 'check',
      modifier: 'primary',
      loading: false,
      onClick: () => onSubmit(basicInfo),
    },
  ];

  return (
    <div className='p-24 h-full'>
      <div style={{ maxWidth: '400px' }} className='mx-auto mb-32'>
        <Steps current={curStep}>
          <Steps.Step title="基本信息" key='basic' />
          <Steps.Step title="字段设计" key='fieldDesign' />
        </Steps>
      </div>
      {curStep === 0 && (
        <SchemaForm
          className='max-w-6xl mx-auto'
          form={form as any}
          components={{ Input, TextArea: Input.TextArea }}
          schema={BASIC_INFO_SCHEMA}
        />
      )}
      {curStep === 1 && <FieldsDesign />}
      <div className='flex justify-center gap-x-10 mt-40'>
        {btnList.map(({
          className = '',
          text,
          key,
          onClick,
          ...restProps
        }) => (
          <Button
            {...restProps}
            key={key}
            className={className}
            onClick={(e) => onClick(key, e)}
          >
            {text}
          </Button>
        ))}
      </div>
    </div>
  );
}

function EditorDataModelDrawer({
  visible,
  isEditor,
  onCancel,
  onSubmit,
}: Props & { visible: boolean }): JSX.Element {
  return (
    <Drawer
      visible={visible}
      title={`${isEditor ? '编辑' : '新建'}数据模型`}
      onCancel={onCancel}
    >
      {store.modelDetailsLoading ? (<PageLoading />) : (
        <EditorDataModel onSubmit={onSubmit} isEditor={isEditor} onCancel={onCancel} />
      )}
    </Drawer>
  );
}

export default observer(EditorDataModelDrawer);

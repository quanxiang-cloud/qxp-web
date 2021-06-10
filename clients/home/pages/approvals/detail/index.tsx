import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import { useQuery } from 'react-query';
import { observer } from 'mobx-react';
import { pick } from 'lodash';

import Breadcrumb from '@c/breadcrumb';
import { useURLSearch } from '@lib/hooks';
import Tab from '@c/tab2';
import Icon from '@c/icon';
import toast from '@lib/toast';
import Loading from '@c/loading';
import { FormRenderer } from '@c/form-builder';

import Panel from './panel';
import Toolbar from './toolbar';
import ActionModals from './action-modals';
import * as apis from '../api';
import { wrapSchemaWithFieldPermission } from './utils';

import store from './store';

import './index.scss';

const globalActionKeys = [
  'canMsg', 'canViewStatusAndMsg', 'hasCancelBtn',
  'hasCcHandleBtn', 'hasReadHandleBtn', 'hasResubmitBtn', 'hasUrgeBtn',
];

function ApprovalDetail(): JSX.Element {
  const [search] = useURLSearch();
  const listType = search.get('list') || 'todo';
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const { processInstanceID, taskID } = useParams<{ processInstanceID: string; taskID: string }>();
  const history = useHistory();

  const {
    isLoading, data, isError, error,
  } = useQuery<any, Error>(
    [processInstanceID, taskID],
    () => apis.getTaskFormById(processInstanceID, taskID),
  );

  useEffect(() => {
    document.title = '流程详情';
  }, []);

  useEffect(() => {
    setFormValues(data?.formData);
  }, [data]);

  // console.log('detail form data:', formValues);

  const renderSchemaForm = () => {
    if (isLoading) {
      return (
        <Loading />
      );
    }

    if (!data || isError) {
      toast.error(error?.message);
      return null;
    }

    return (
      <div className='task-form'>
        <FormRenderer
          defaultValue={data.formData}
          schema={wrapSchemaWithFieldPermission(data.form.table, data?.fieldPermission?.custom)}
          onFormValueChange={setFormValues}
        />
      </div>
    );
  };

  return (
    <div>
      <Breadcrumb
        segments={[
          {
            key: 'back', text: '返回', render: (seg) =>
              (
                <span className="inline-flex items-center cursor-pointer" onClick={() => history.goBack()}>
                  <Icon name="keyboard_backspace" className="mr-6" />返回
                </span>
              ),
          },
          { key: 'list', text: '审批列表', path: `/approvals?list=${listType}` },
          { key: 'current', text: data?.flowName },
        ]}
        className="px-24 py-20"
      />

      <div className="approval-detail w-full h-full flex px-20">
        <Panel className="flex flex-col flex-1 mr-20 px-24 py-24">
          <Toolbar
            permission={data?.operatorPermission || {}}
            globalActions={pick(data || {}, globalActionKeys)}
            onClickAction={store.handleClickAction}
          />
          {renderSchemaForm()}
        </Panel>
        <Panel className="approval-detail-tab w-400">
          <Tab
            items={[
              {
                id: 'history',
                name: '动态',
                content: (<div>动态</div>),
              },
              {
                id: 'discuss',
                name: '讨论',
                content: (<div>讨论</div>),
              },
            ]}
          />
        </Panel>
      </div>
      <ActionModals flowName={data?.flowName} getFormData={()=> formValues} />
    </div>
  );
}

export default observer(ApprovalDetail);

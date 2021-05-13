import React, { useState } from 'react';
import { TextArea } from '@QCFE/lego-ui';
import { useParams, useHistory } from 'react-router';
import { useQuery } from 'react-query';

import Breadcrumb from '@c/breadcrumb';
import { useURLSearch } from '@lib/hooks';
import Tab from '@c/tab';
import Icon from '@c/icon';
import Button from '@c/button';
import Select from '@c/select';
import Modal from '@c/modal';
import toast from '@lib/toast';
import Loading from '@c/loading';

import { FormRenderer } from '@c/form-builder';

import Panel from './panel';
import * as apis from '../api';
import { parseFormValue } from '../utils';

import './index.scss';

type PermissionItem = {
  enabled: boolean;
  name: string;
  value?: string;
  text?: string;
  defaultText?: string;
  changeable?: boolean;
}

const moreActions = [
  { label: '打印', value: 'print' },
  { label: '分享', value: 'share' },
  { label: '流转图', value: 'chart' },
];

const actionMap = {
  // backend fileds
  SUBMIT: '提交',
  RE_SUBMIT: '再次提交',
  CANCEL: '撤回',
  AGREE: '同意',
  REFUSE: '拒绝',
  FILL_IN: '填写',
  ENTRUST: '委托',
  STEP_BACK: '退回某步',
  SEND_BACK: '打回重填',
  CC: '抄送',
  ADD_SIGN: '加签',
  READ: '阅示',

  // fixme: use chinese as action key
  // 操作: '',
  // 驳回: '',
};

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
    () => apis.getTaskFormById(processInstanceID, taskID)
  );

  const [modalTypeReview, setModalTypeReview] = useState(false);
  const [reviewPassComment, setReviewPassComment] = useState('');

  const [modalTypeReject, setModalTypeReject] = useState(false);
  const [reviewRejectComment, setReviewRejectComment] = useState('');

  const [modalTypeFillIn, setModalTypeFillIn] = useState(false);
  const [reviewFillInComment, setReviewFillInComment] = useState('');

  // console.log('detail form data:', formValues);

  const handleAction = (actionName: string, actionValue?: string) => {
    if (actionName === '提交' || actionValue === 'FILL_IN') {
      setModalTypeFillIn(true);
    }
    // todo: other actions
  };

  const renderToolbarActions = () => {
    const { custom = [], default: defaultActions = [] } = data?.operatorPermission || {} as { custom: PermissionItem[], default: PermissionItem[] };

    return (
      <>
        <div className="left-btns task-custom-actions flex flex-1">
          {custom.map(({ name, value, enabled, defaultText, text }: PermissionItem) => {
            if (!enabled) {
              return null;
            }
            return (
              <span key={name} onClick={(ev) => handleAction(name, value)}>
                <Icon name="api" />{text ?? defaultText ?? name}
              </span>
            );
          })}
          <span>
            <Select multiple={false} options={moreActions} onChange={() => {}}>
              <span>
                <Icon name="more_horiz" /> 更多
              </span>
            </Select>
          </span>
        </div>

        <div className="right-btns task-default-actions">
          {
            defaultActions.map(({ name, value, enabled, defaultText, text }: PermissionItem) => {
              if (!enabled) {
                return null;
              }
              // fixme: compat with legacy name
              if (name === '操作' || value === 'AGREE') {
                return (
                  <Button
                    iconName="done"
                    modifier="primary"
                    className="btn-item-done"
                    onClick={() => setModalTypeReview(true)}
                    key={name}
                  >
                    {text ?? defaultText ?? name}
                  </Button>
                );
              }
              if (name === '驳回' || value === 'REFUSE') {
                return (
                  <Button iconName="close" modifier="danger" onClick={() => setModalTypeReject(true)} key={name}>
                    {text ?? defaultText ?? name}
                  </Button>
                );
              }
            })
          }
        </div>
      </>
    );
  };

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
          defaultValue={parseFormValue(data.formData)}
          schema={data.form.table}
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
          <div className="approval-detail-toolbar flex justify-between items-center px-10 pb-20 mb-24">
            {renderToolbarActions()}
          </div>
          {renderSchemaForm()}
        </Panel>
        <Panel className="approval-detail-tab w-400">
          <Tab
            activeTitleClassName="border-blue-600 border-b-4"
            headerClassName="border-gray-200 border-b-1"
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

      {modalTypeReview && (
        <Modal
          title={`通过 ${data?.flowName}`}
          okText='确定通过'
          onClose={() => setModalTypeReview(false)}
          onConfirm={async () => {
            try {
              const data = await apis.reviewTask(processInstanceID, taskID, {
                remark: reviewPassComment,
                handleType: 'AGREE',
              });
              if (data) {
                toast.success('审核通过');
                setModalTypeReview(false);
                history.push('/approvals?list=done');
              }
            } catch (err) {
              toast.error(err.message);
            }
          }}
        >
          <TextArea
            rows={4}
            name="comment"
            placeholder="输入通过意见 (选填)"
            onChange={(ev: unknown, value: string) => setReviewPassComment(value)} />
        </Modal>
      )}

      {modalTypeReject && (
        <Modal
          title={`拒绝 ${data?.flowName}`}
          okText='确定拒绝'
          onClose={() => setModalTypeReject(false)}
          onConfirm={async () => {
            try {
              const data = await apis.reviewTask(processInstanceID, taskID, {
                remark: reviewRejectComment,
                handleType: 'REFUSE',
              });
              if (data) {
                setModalTypeReview(false);
                history.push('/approvals?list=done');
              }
            } catch (err) {
              toast.error(err.message);
            }
          }}
        >
          <TextArea
            rows={4}
            name="comment"
            placeholder="输入拒绝意见 (选填)"
            onChange={(ev: unknown, value: string) => setReviewRejectComment(value)} />
        </Modal>
      )}

      {modalTypeFillIn && (
        <Modal
          title={`提交 ${data?.flowName}`}
          okText='确定提交'
          onClose={() => setModalTypeFillIn(false)}
          onConfirm={async () => {
            try {
              const data = await apis.reviewTask(processInstanceID, taskID, {
                remark: reviewFillInComment,
                handleType: 'FILL_IN',
              });
              if (data) {
                toast.success('提交成功');
                setModalTypeFillIn(false);
                history.push('/approvals?list=done');
              }
            } catch (err) {
              toast.error(err.message);
            }
          }}
        >
          <TextArea
            rows={4}
            name="comment"
            placeholder="输入提交意见 (选填)"
            onChange={(ev: unknown, value: string) => setReviewFillInComment(value)} />
        </Modal>
      )}
    </div>
  );
}

export default ApprovalDetail;

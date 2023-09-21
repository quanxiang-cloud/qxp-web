import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSearchParam } from 'react-use';
import { observer } from 'mobx-react';
import cs from 'classnames';

import NavPage from '@m/components/nav-page';
import FileUploader, { FileUploaderInstance } from '@m/components/file-uploader';
import { defaultMaxFileSize } from '@m/components/file-uploader/use-uploader';
import { TextArea, InputInstance } from '@m/qxp-ui-mobile/input';
import { Button } from '@m/qxp-ui-mobile/button';
import UserPicker from '@m/components/user-picker';
import Radio from '@c/radio';
import RadioGroup from '@c/radio/group';
import Picker from '@m/qxp-ui-mobile/picker';
import toast from '@lib/toast';

import { getAction } from './utils';
import ActionItem from './action-item';
import Warning from './warning';
import { ApprovalDetailParams } from '../../types';
import approvalDetailStore from '../store';
import actionStore from './store';
import {
  reviewTask, resubmit, readHandle, ccFlow, stepBack, sendBack, inviteReadHandle, deliver, addSign,
  getStepBackActivityList,
} from './api';

import './index.scss';
import { submitFillTask } from '@home/pages/approvals/api';

const REQUIRED_PROCESS_INSTANCE = ['DELIVER', 'READ', 'CC'];

function ApprovalsActions(): JSX.Element {
  const history = useHistory();
  const uploaderRef = useRef<FileUploaderInstance>(null);
  const { processInstanceID, taskID } = useParams<ApprovalDetailParams>();
  const action = useSearchParam('action') || '';
  const reasonRequired = useSearchParam('reasonRequired') || 0;
  const { remark, handleUserIds, taskDefKey, multiplePersonWay, type } = actionStore;
  const { formValues } = approvalDetailStore;
  const { title, actionName } = getAction(action, approvalDetailStore.title);
  const commonWords = ['我已阅示，非常赞同', '我已阅示，这个情况还是谨慎处理吧', '我已阅示'];
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<InputInstance>(null);

  useEffect(() => {
    if (action === 'STEP_BACK') {
      getStepBackActivityList(processInstanceID).then((res) => {
        actionStore.stepBackActivityList = res.map((stepBackItem) => {
          return {
            value: stepBackItem.taskDefKey,
            label: stepBackItem.taskName,
          };
        });
      });
    }
  }, []);

  useEffect(() => {
    if (actionStore.handleUserIds.length) {
      actionStore.setIsValidate(true);
    }
  }, [actionStore.handleUserIds]);

  function validate(text: string): string | undefined {
    let errorInfo = '';
    switch (action) {
    case 'SEND_BACK':
      errorInfo = '请输入打回重填原因';
      break;
    case 'AGREE':
      errorInfo = '请输入通过意见';
      break;
    case 'REFUSE':
      errorInfo = '请输入拒绝意见';
      break;
    case 'hasReadHandleBtn':
      errorInfo = '请输入阅示意见';
      break;
    }
    if (!text || text.length < 1) return errorInfo;
    return undefined;
  }

  function handleFlow(): void {
    if (REQUIRED_PROCESS_INSTANCE.includes(action) && !handleUserIds.length) {
      actionStore.setIsValidate(false);
      return;
    }

    if (action === 'STEP_BACK' && !taskDefKey) {
      actionStore.setIsValidate(false);
      return;
    }

    textareaRef.current?.focus();
    textareaRef.current?.blur();
    const actionResult = requestAction();
    actionResult && setLoading(true);
    actionResult?.then(() => {
      toast.success(`已${actionName}`);
      history.go(-2);
      approvalDetailStore.isRefresh = true;
    }).catch((err) => toast.error(err)).finally(() => setLoading(false));
  }

  function requestAction(): Promise<any> | undefined {
    switch (action) {
    case 'AGREE':
      if (reasonRequired && !remark) return;
      return reviewTask('AGREE', processInstanceID, taskID, remark, formValues);
    case 'REFUSE':
      if (reasonRequired && !remark) return;
      return reviewTask('REFUSE', processInstanceID, taskID, remark);
    case 'hasResubmitBtn':
      return resubmit(processInstanceID, formValues);
    case 'FILL_IN':
      // reviewTask('FILL_IN', processInstanceID, taskID, remark, formValues);
      return submitFillTask({
        id: taskID,
        formData: formValues,
      });
    case 'hasReadHandleBtn':
      if (!remark) return;
      return readHandle(processInstanceID, taskID, remark);
    case 'STEP_BACK':
      return stepBack('STEP_BACK', processInstanceID, taskID, remark, taskDefKey);
    case 'SEND_BACK':
      if (!remark) return;
      return sendBack('SEND_BACK', processInstanceID, taskID, remark);
    case 'CC':
      return ccFlow('CC', processInstanceID, taskID, remark, handleUserIds);
    case 'READ':
      return inviteReadHandle('READ', processInstanceID, taskID, remark, handleUserIds);
    case 'DELIVER':
      return deliver('DELIVER', processInstanceID, taskID, remark, handleUserIds, formValues);
    case 'ADD_SIGN':
    {
      let checkPassed = true;
      if (!handleUserIds.length) {
        actionStore.setIsValidate(false);
        checkPassed = false;
      }
      if (!type) {
        actionStore.typeError = true;
        checkPassed = false;
      }
      if (handleUserIds.length > 1 && !multiplePersonWay) {
        actionStore.multiplePersonWayError = true;
        checkPassed = false;
      }
      if (!checkPassed) return;
      const assignee = handleUserIds.map((user) => {
        return {
          id: user,
        };
      });
      return addSign(processInstanceID, taskID, assignee, multiplePersonWay, type);
    }
    }
    return undefined;
  }
  return (
    <NavPage title={title} absolute className='flex flex-col'>
      <div className='flex-1 mt-16 mx-12'>
        {('AGREE' === action || 'REFUSE' === action) && (
          <>
            <div className='mb-8'>意见</div>
            <TextArea
              ref={textareaRef}
              placeholder={`请输入${actionName}意见${reasonRequired ? '（必填）' : ' (选填)'}`}
              defaultValue={actionStore.remark}
              onChange={(val) => actionStore.setRemark(val)}
              validate={reasonRequired ? validate : undefined}
            />
            <div className='mt-16 mb-8'>附件</div>
            <FileUploader
              multiple
              desc='点击上传附件，最大5MB'
              maxFileSize={defaultMaxFileSize}
              ref={uploaderRef}
            />
          </>
        )}
        {'CC' === action && <ActionItem approvalTitle='选择审批人' title='抄送给' actionName={actionName}/>}
        {'READ' === action && <ActionItem approvalTitle='选择阅示人' title='阅示人' actionName={actionName}/>}
        {('DELIVER' === action || 'ENTRUST' === action) && (
          <ActionItem approvalTitle='选择接受人' title='转交给' actionName={actionName} single/>
        )}
        {'SEND_BACK' === action && (
          <>
            <Warning text='将工作流任务打回至初始节点，发起人重新填写后继续流转，不中断任务'/>
            <div className='mb-8'>原因</div>
            <TextArea
              placeholder='请输入打回重填原因'
              validate={reasonRequired ? validate : undefined}
              defaultValue={actionStore.remark}
              onChange={(val) => actionStore.remark = val}
            />
            <div className='mt-16 mb-8'>附件</div>
            <FileUploader
              multiple
              desc='点击上传附件，最大5MB'
              maxFileSize={defaultMaxFileSize}
            />
          </>
        )}
        {'STEP_BACK' === action && (
          <>
            <Warning text='将工作流任务回退至已流转过的节点（除开始节点），不中断任务' />
            <Picker
              title='节点'
              placeholder='请选择要回退到的节点'
              className={cs('mb-16', { 'picker-error': !actionStore.isValidate })}
              onChange={(value) => actionStore.taskDefKey = value}
              options={actionStore.stepBackActivityList}
            />
            {!actionStore.isValidate && (
              <div className='picker-error-text caption flex-1 -mt-8'>请选择节点</div>
            )}
            <div className='mb-8'>原因</div>
            <TextArea
              placeholder={`请输入${actionName}原因（选填）`}
              defaultValue={actionStore.remark}
              onChange={(val) => actionStore.remark = val}
            />
          </>
        )}
        {'hasReadHandleBtn' === action && (
          <>
            <div className='mb-8'>意见</div>
            <TextArea
              ref={textareaRef}
              placeholder={`请输入${actionName}意见`}
              validate={validate}
              defaultValue={actionStore.remark}
              onChange={(val) => actionStore.remark = val}
            />
            {commonWords.map((wordItem, index) => {
              return (
                <div
                  key={index}
                  className='action-button-read'
                  onClick={() => {
                    actionStore.remark = wordItem;
                    textareaRef.current?.setValue(wordItem);
                  }}
                >
                  {wordItem}
                </div>
              );
            })}
          </>
        )}
        {'ADD_SIGN' === action && (
          <>
            <div className='mb-8'>审批人</div>
            <UserPicker title='选择审批人' onChange={(val) => actionStore.handleUserIds = val} />
            {!actionStore.isValidate && (
              <p className='caption text-red-600 mt-4'>
                {`请选择${actionName}人`}
              </p>
            )}
            <div className='mb-8 mt-16'>加签方式</div>
            <div className='flex items-center'>
              <RadioGroup onChange={(val) => {
                actionStore.type = val as string;
                actionStore.typeError = false;
              }}>
                <Radio className="mr-22" label='此节点前加签' value='BEFORE' radioClass='w-20 h-20' />
                <Radio label='此节点后加签' value='AFTER' radioClass='w-20 h-20' />
              </RadioGroup>
            </div>
            {actionStore.typeError && <div className='error-text caption'>请选择加签方式</div>}
            {actionStore.handleUserIds.length > 1 && (
              <>
                <div className='mb-8 mt-16'>处理方式</div>
                <div className='flex items-center'>
                  <RadioGroup onChange={(val) => {
                    actionStore.multiplePersonWay = val as string;
                    actionStore.multiplePersonWayError = false;
                  } }>
                    <Radio label='会签' value='and' className='mr-22' radioClass='w-20 h-20' />
                    <Radio label='或签' value='or' radioClass='w-20 h-20' />
                  </RadioGroup>
                </div>
              </>
            )}
            {actionStore.multiplePersonWayError && <div className='error-text caption'>请选择处理方式</div>}
          </>
        )}
        {('FILL_IN' === action) && (
          <>
            <div className='mb-8'>提交</div>
            <div>是否确定提交？</div>
          </>
        )}
        {('hasResubmitBtn' === action) && (
          <>
            <div className='mb-8'>意见</div>
            <TextArea
              placeholder={`请输入${actionName}意见${reasonRequired ? '' : ' (选填)'}`}
              validate={reasonRequired ? validate : undefined}
              defaultValue={actionStore.remark}
              onChange={(val) => actionStore.remark = val}
            />
          </>
        )}
      </div>
      <div className='flex action-buttons-container'>
        <Button
          className='action-button-cancel action-button__light h-44 mr-8'
          onClick={() => history.goBack()}
        >取消</Button>
        <Button
          className='action-button-confirm h-44'
          onClick={handleFlow}
          loading={loading}
        >
          {`确定${actionName}`}
        </Button>
      </div>
    </NavPage>
  );
}

export default observer(ApprovalsActions);

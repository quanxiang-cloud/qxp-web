/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';
import useCss from 'react-use/lib/useCss';

import Icon from '@c/icon';
import toast from '@lib/toast';
import PopConfirm from '@c/pop-confirm';
import FormDataDetailsCard from '@c/form-data-details-card';

import { getOperateButtonPer } from './utils';

import './index.scss';
import DetailsApproval from './approval';
import { getAllProcess } from './approval/api';
import { isArray } from 'lodash';
import Button from '@c/button';
import { getTaskFormById } from '../approvals/api';
import { FILL_IN } from '../approvals/constant';
import { getAllPipelineProcess } from '../new-approvals/util';
import { getAllProcessInfo } from '../new-approvals/api';

type Props = {
  onCancel: () => void;
  goEdit: (rowID: string) => void;
  delData: (rowIDs: string[]) => Promise<unknown>;
  setOperationType: ( type: string ) => void;
  rowID: string;
  tableName: string;
  tableID: string;
  authority: Record<string, boolean>;
  appID: string;
}

function DetailsDrawer(
  { onCancel, rowID, goEdit, delData, tableName, tableID, authority, appID, setOperationType }: Props,
): JSX.Element {
  const [beganClose, setBeganClose] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(window?.isMobile ? true : false);
  const [approveProcessData, setApproveProcessData] = useState<any>();
  const [status, setStatus] = useState<any>();
  const { USER } = window;
  useEffect(()=>{
    getApproveProcessData();
  }, []);

  const handleCancel = (): void => {
    setBeganClose(true);
    setTimeout(() => {
      setVisible(true);
      onCancel();
    }, 300);
  };

  const handelDelete = (): void => {
    delData([rowID]).then(() => {
      handleCancel();
    }).catch((err) => {
      toast.error(err);
    });
  };

  // 获取审批动态
  const getApproveProcessData = ()=>{
    getAllProcess(rowID)
      .then((res: any)=>{
        if (isArray(res) && res?.length) {
          let taskID;
          res.find((item: any)=>{
            taskID = item?.taskID;
            return item?.taskID;
          });
          if (taskID) {
            getAllProcessInfo(taskID)
              .then((res: any)=>{
                getAllPipelineProcess(res?.[0]?.Data, res?.[1]?.data).then((res: any)=>{
                  setApproveProcessData(res);
                  setStatus(res[0]?.status);
                });
              }).catch((err)=>{
                setApproveProcessData(null);
              });
          }
        }
      })
      .catch((err)=>{
        setApproveProcessData(null);
      });
  };

  // 去审批页
  const goApproval = (): void=>{
    const { processInstanceId, taskType, operationRecords,
      taskID, id } = approveProcessData?.[0] || {};
    let _taskType = 'approval';
    if (taskType === 'FILL') {
      _taskType = FILL_IN;
    }
    if (operationRecords?.[0]?.taskId) {
      // window.location = `/approvals/${processInstanceId}/${operationRecords?.[0]?.taskId}/ALL_PAGE/${_taskType}` as any;
      window.location = `/approvals/${taskID}/${id}/ALL_PAGE/${_taskType}` as any;
    } else {
      getTaskFormById(processInstanceId, { type: 'ALL_PAGE', taskId: '' })
        .then((res: any)=>{
          const { taskDetailModels } = res || {};
          const { taskId } = taskDetailModels?.[0] || {};
          // window.location = `/approvals/${processInstanceId}/${taskId}/ALL_PAGE/${_taskType}` as any;
          window.location = `/approvals/${taskID}/${id}/ALL_PAGE/${_taskType}` as any;
        })
        .catch((err)=>{
        // window.open(`/approvals/${processInstanceId}/${id}/ALL_PAGE`);
        });
    }
  };

  const handleBtn = ()=>{
    try {
      return approveProcessData[0]?.operationRecords?.find((item: any)=> item?.creatorId === USER?.id && USER?.name === item?.creatorName);
    } catch (error) {
      return false;
    }
  };
  return (
    <div
      className={cs('page-data-drawer-modal-mask', {
        'page-data-drawer-began-close': beganClose,
        'page-data-drawer-close': visible,
        'page-data-drawer-is-mobile': window?.isMobile,
      })}
      onClick={handleCancel}
    >
      <div
        className={cs('page-data-drawer-container', useCss({
          width: fullScreen ? '100%' : '66%',
        }))}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='page-data-drawer-header'>
          <span className='text-h5'>{tableName}</span>
          <div className='flex items-center gap-x-12'>
            <span onClick={() => setFullScreen(!fullScreen)} className='icon-text-btn'>
              <Icon size={20} name={fullScreen ? 'unfull_screen' : 'full_screen'} />
              {fullScreen ? '非' : ''}全屏
            </span>
            {getOperateButtonPer('update', { appID, tableID, authority }) && (
              <span
                className='icon-text-btn'
                onClick={() => {
                  setOperationType('修改');
                  goEdit(rowID);
                }}
              >
                <Icon size={20} name='edit' />
                修改
              </span>
            )}
            {getOperateButtonPer('delete', { appID, tableID, authority }) && (
              <PopConfirm content='确认删除该数据？' onOk={handelDelete} >
                <span className='icon-text-btn'><Icon size={20} name='delete' />删除</span>
              </PopConfirm>
            )}
            <Icon onClick={handleCancel} clickable changeable name='close' size={24} />
          </div>
        </div>
        <div className='table-view-detail-wrap'>
          <FormDataDetailsCard
            className='px-20 py-16'
            rowID={rowID}
            appID={appID}
            tableID={tableID}
            fullScreen={fullScreen}
          />
          {
            approveProcessData &&
            (<div className='approvel-wrap'>
              {
                status === 'REVIEW' && !!handleBtn() &&
                (<div className='btn-wrapper'>
                  <Button modifier='primary' onClick={goApproval}>{
                    approveProcessData[0]?.taskType === 'FILL' ? '去填写' : '去审批'
                  }</Button>
                </div>)
              }
              <DetailsApproval data={approveProcessData}/>
            </div>)
          }
        </div>
      </div>
    </div>
  );
}

export default observer(DetailsDrawer);

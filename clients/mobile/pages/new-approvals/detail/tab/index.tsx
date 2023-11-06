import React, { RefObject, useEffect, useMemo, useRef } from 'react';
import { observer } from 'mobx-react';
import { useSetState } from 'react-use';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import cs from 'classnames';
import { toJS } from 'mobx';

import { ApprovalDetailParams } from '@m/pages/approvals/types';
import Loading from '@m/qxp-ui-mobile/loading';
import { Empty } from '@m/qxp-ui-mobile/empty';
import Icon from '@m/qxp-ui-mobile/icon';
import Popper from '@c/popper';
import { FormRenderer } from '@c/form-builder';
import { approvalActionPath } from '@m/constant';

import { handleCc } from '../actions/api';
import store from '../store';
import ApprovalsActionStore from '../actions/store';

import './index.scss';
import toast from '@lib/toast';

export interface ApprovalsDetailTabProps {
  height: string;
  index: number;
  active: boolean;
}

function ApprovalsDetailTab(props: ApprovalsDetailTabProps): JSX.Element {
  const { processInstanceID, taskID, type } = useParams<ApprovalDetailParams>();

  const history = useHistory();

  const submitRef = useRef<HTMLButtonElement>(null);

  const [state, setState] = useSetState({
    loading: false,
    error: false,
  });

  const task = useMemo(() => store.taskDetails[props.index], [props.index]);

  useEffect(init, []);
  useEffect(() => {
    if (props.active) return;
    if (popperRef?.current?.visible) {
      popperRef?.current?.close();
    }
  }, [props.active]);

  function init(): void {
    if (task?.formSchema && Object.keys(task?.formSchema)?.length) return;
    setState({ loading: true, error: false });
    store.initForm(props.index, processInstanceID, type, task.taskId ?? taskID)
      .then((res) => setState({ loading: false, error: !res }));
  }

  function onActionClick(action: string, reasonRequired?: boolean): void {
    ApprovalsActionStore.reset();
    popperRef?.current?.close();
    submitRef?.current?.click();
    if ('hasCcHandleBtn' === action) {
      handleCc(taskID).then(() => {
        toast.success('标记已读完成');
      }).catch((err) => toast.error(err));
      return;
    }

    const actionPath = approvalActionPath.replace(':processInstanceID/:taskID/:type',
      `${processInstanceID}/${taskID}/${type}`,
    );
    history.push(
      reasonRequired ? `${actionPath}?action=${action}&reasonRequired=1` : `${actionPath}?action=${action}`,
    );
  }

  const popperRef = useRef<Popper>(null);
  const reference = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>;

  function renderMorePop(): JSX.Element {
    return (
      <div className='more-pop-window'>
        {
          task?.more?.map((item) => {
            return (
              <div key={item.key}
                className='more-pop-item body2 text-secondary pointer'
                onClick={(e) => {
                  e.stopPropagation();
                  onActionClick(item.key, item.reasonRequired);
                }}
              >
                {!!item.icon && <Icon name={item.icon} size='.2rem' className='mr-4'/>}
                <div>{item.text}</div>
              </div>
            );
          })
        }
      </div>
    );
  }

  return (
    <>
      <div className='flex flex-col'
        style={{ height: props.height }}>

        {state.loading && <Loading className='pt-16 pb-16'>加载中...</Loading>}

        {!state.loading && state.error && (
          <Empty
            onClick={init}
            title='加载失败'
            content='请点击此处重新加载'
            image='/dist/images/no-approval-task.svg'/>
        )}

        {!state.loading && !state.error && !!task.formSchema && (
          <>
            <div className='flex-1 overflow-scroll'>
              <FormRenderer
                className='h-full'
                value={toJS(task.formData)}
                schema={toJS(task.formSchema)}
                onSubmit={(val) => store.formValues = val}
                readOnly={type === 'APPLY_PAGE' || type === 'HANDLED_PAGE' }
                usePermission>
                <button type='submit' ref={submitRef} className='hidden'/>
              </FormRenderer>
            </div>

            {(!!task.custom?.length || !!task.system?.length) && (
              <div className='flex justify-between action-buttons-container'>
                {!!task.custom?.length && (
                  <div className='action-button-custom-wrapper text-secondary'>
                    {
                      task.custom.map((item) => {
                        return (
                          <div
                            key={item.key}
                            className='action-button__custom flex justify-center items-center'
                            ref={item.key === 'MORE' ? reference : undefined}
                            onClick={
                              item.key === 'MORE' ?
                                undefined : () => onActionClick(item.key, item.reasonRequired)
                            }
                          >
                            {!!item.icon && <Icon name={item.icon} size='.2rem' className='mb-4'/>}
                            <div className='action-button__custom-text body2 truncate w-full'>
                              {item.text}
                            </div>
                          </div>
                        );
                      })
                    }
                    {task.custom.length < 3 && <div style={{ flex: 3 - task.custom.length }}/>}
                  </div>
                )}

                {type === 'WAIT_HANDLE_PAGE' && !!task.system?.length && task.system.map((item) => {
                  return (
                    <div
                      key={item.key}
                      className={cs('action-button__system flex justify-center items-center', item.className)}
                      onClick={() => onActionClick(item.key, item.reasonRequired)}>
                      {!!item.icon && <Icon name={item.icon} size='.2rem' className='mr-4'/>}
                      <div className='truncate'>{item.text}</div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className='safe-area-bottom'/>
          </>
        )}

      </div>

      {!!task.more?.length && (
        <Popper
          ref={popperRef}
          reference={reference}
          placement='top-start'
          className='z-50'
        >
          {renderMorePop()}
        </Popper>
      )}

    </>

  );
}

export default observer(ApprovalsDetailTab);

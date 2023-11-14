/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable max-len */
import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import toast from '@lib/toast';
import { ApprovalsTabProps, Task } from '@m/pages/new-approvals/types';
import PullRefresh from '@m/qxp-ui-mobile/pull-refresh';
import TaskCard from '@m/components/task-card';
import List from '@m/qxp-ui-mobile/list';
import { Empty } from '@m/qxp-ui-mobile/empty';
import { readAll } from '@home/pages/new-approvals/api';
import { approvalDetailPath, approvalDetailPathApproval } from '@m/constant';
import detailStore from '@m/pages/new-approvals/detail/store';

import { Filter } from './filter';
import { store } from './store';
import RadioButtonGroup from '@c/radio/radio-button-group';
import { APPROVAL, FILL_IN, listData } from '@home/pages/new-approvals/constant';

const mapPageKey: any = {
  APPLY_PAGE: 'FILL_IN_APPLY_PAGE',
  HANDLED_PAGE: 'FILL_IN_HANDLED_PAGE',
  WAIT_HANDLE_PAGE: 'FILL_IN_WAIT_HANDLE_PAGE',
};

const getQueryParams = ()=>{
  const params: any = {};
  const query = window.location.search.replace('?', '').split('&');
  query.forEach((item: any)=>{
    const arr = item.split('=');
    params[arr[0]] = arr[1];
  });
  return params;
};

const ApprovalsTab = (props: ApprovalsTabProps): JSX.Element => {
  const { filterKey, empty, tagType, filter, onFilterClick, filterShow, type, onTabClick, isApply, tabType } = props;
  const history = useHistory();
  const queryParams = getQueryParams();

  const storeType = useMemo(() => {
    if (!tagType) return type;
    return `${type}_${tagType}`;
  }, [type, tagType]);

  function loadApprovals(pageKey: number): Promise<void> {
    store[storeType].finished = false;
    store[mapPageKey[storeType]].finished = false;
    if (mapPageKey[storeType]) {
      store[mapPageKey[storeType]].loadApprovals({ pageKey, filter, filterKey, tagType })
        .finally(()=>{
          store[storeType].finished = true;
          store[mapPageKey[storeType]].finished = true;
          detailStore.isRefresh = false;
        });
    }
    return store[storeType].loadApprovals({ pageKey, filter, filterKey, tagType })
      .finally(()=>{
        store[storeType].finished = true;
        store[mapPageKey[storeType]].finished = true;
        detailStore.isRefresh = false;
      });
  }

  useEffect(() => {
    if (!store[storeType].inited) return;
    store[storeType].clear();
    store[mapPageKey[storeType]].clear();
    loadApprovals(1);
  }, [props.filter]);

  useEffect(() => store[storeType].clear, []);

  useEffect(() => {
    if (detailStore.isRefresh) {
      store[storeType].clear();
      store[mapPageKey[storeType]].clear();
      loadApprovals(1);
    }
  }, [detailStore.isRefresh]);

  function onTaskCardClick(task: Task): void {
    detailStore.init(task.name);
    let _taskType = taskType;
    if (isApply) {
      switch (tabType) {
      case FILL_IN:
        _taskType = FILL_IN;
        break;
      default:
        _taskType = 'approval';
        break;
      }
    }
    if (_taskType === 'approval') {
      const path = approvalDetailPathApproval.replace(':processInstanceID', task.processInstanceId)
        .replace(':taskID', task.taskId ?? task.id ?? '')
        .replace(':type', type);
      history.push(path);
    } else {
      const path = approvalDetailPath.replace(':processInstanceID', task.processInstanceId)
        .replace(':taskID', task.taskId ?? task.id ?? '')
        .replace(':type', type)
        .replace(':taskType', _taskType ?? '');
      history.push(path);
    }
  }

  async function ccReadAll(): Promise<boolean> {
    const listFiltered = store[storeType].list.filter((task) => task.handled === 'ACTIVE')
      .map((task) => task.taskId || task.id || '');
    if (!listFiltered?.length) {
      return true;
    }
    try {
      const data = await readAll(listFiltered);
      if (data) {
        toast.success('操作成功');
        loadApprovals(1);
      }
      return !!data;
    } catch (err) {
      toast.error(err);
    }
    return false;
  }

  const [taskType, setTaskType] = useState(APPROVAL);

  useEffect(()=>{
    setTaskType(queryParams?.tagType || APPROVAL);
  }, [queryParams?.tagType]);

  const handleChange = (val: any)=>{
    setTaskType(val);
    onTabClick && onTabClick(val);
  };

  const getCurrentValue = ()=>{
    switch (taskType) {
    case FILL_IN:
      return FILL_IN;
    default:
      return APPROVAL;
    }
  };

  return (
    <div className='overflow-scroll flex flex-col'
      style={{ height: 'calc(100vh - 0.44rem - 0.42rem - 1px)' }}>
      <div className='flex space-between{'>
        {
          isApply &&
        mapPageKey[storeType] &&
          (<RadioButtonGroup
            className="mobile-tab-radio-btn-group"
            radioBtnClass="bg-white"
            onChange={handleChange}
            currentValue={getCurrentValue()}
            listData={listData}
          />)
        }

        {
          isApply &&
        (<Filter key={props.type}
          filterKey={filterKey}
          type={props.type}
          filter={filter}
          show={!!filterShow}
          onClickCCReadAll={type === 'CC_PAGE' && store[storeType].readAllEnabled ? ccReadAll : undefined}
          onFilterClick={onFilterClick}/>)
        }

      </div>

      {
        taskType !== FILL_IN &&
          (<PullRefresh
            onRefresh={() => loadApprovals(1)}
            className='flex-1'>
            <List
              finished={store[storeType].finished}
              style={{ padding: '0 .16rem' }}
              onLoad={() => loadApprovals(store[storeType].page + 1)}
              className='h-full overflow-scroll safe-area-bottom'>
              {store[storeType].list.length > 0 && (store[storeType].list.map((task) =>
                (<TaskCard
                  onClick={() => onTaskCardClick(task)}
                  key={task.id}
                  task={task}
                  type={props.type}
                  className='mt-4 mb-8'/>
                )))
              }
              {store[storeType].list.length < 1 && store[storeType].inited && <Empty {...empty}/>}
            </List>
          </PullRefresh>)
      }

      {
        taskType === FILL_IN &&
          (<PullRefresh
            onRefresh={() => loadApprovals(1)}
            className='flex-1'>
            <List
              finished={store[mapPageKey[storeType]].finished}
              style={{ padding: '0 .16rem' }}
              onLoad={() => loadApprovals(store[mapPageKey[storeType]].page + 1)}
              className='h-full overflow-scroll safe-area-bottom'>
              {store[mapPageKey[storeType]].list.length > 0 && (store[mapPageKey[storeType]].list.map((task) =>
                (<TaskCard
                  onClick={() => onTaskCardClick(task)}
                  key={task.id}
                  task={task}
                  type={props.type}
                  taskType={taskType}
                  isApply = {isApply}
                  className='mt-4 mb-8'/>
                )))
              }
              {store[mapPageKey[storeType]].list.length < 1 && store[mapPageKey[storeType]].inited && <Empty {...empty}/>}
            </List>
          </PullRefresh>)
      }

    </div>
  );
};

export default observer(ApprovalsTab);

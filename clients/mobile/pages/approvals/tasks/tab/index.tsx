import React, { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import toast from '@lib/toast';
import { ApprovalsTabProps, Task } from '@m/pages/approvals/types';
import PullRefresh from '@m/qxp-ui-mobile/pull-refresh';
import TaskCard from '@m/components/task-card';
import List from '@m/qxp-ui-mobile/list';
import { Empty } from '@m/qxp-ui-mobile/empty';
import { readAll } from '@home/pages/approvals/api';
import { approvalDetailPath } from '@m/constant';
import detailStore from '@m/pages/approvals/detail/store';

import { Filter } from './filter';
import { store } from './store';

const ApprovalsTab = (props: ApprovalsTabProps): JSX.Element => {
  const { filterKey, empty, tagType, filter, onFilterClick, filterShow, type } = props;
  const history = useHistory();

  const storeType = useMemo(() => {
    if (!tagType) return type;
    return `${type}_${tagType}`;
  }, [type, tagType]);

  function loadApprovals(pageKey: number): Promise<void> {
    return store[storeType].loadApprovals({ pageKey, filter, filterKey, tagType });
  }

  useEffect(() => {
    if (!store[storeType].inited) return;
    loadApprovals(1);
  }, [props.filter]);

  useEffect(() => store[storeType].clear, []);

  useEffect(() => {
    if (detailStore.isRefresh) {
      loadApprovals(1);
      detailStore.isRefresh = false;
    }
  }, [detailStore.isRefresh]);

  function onTaskCardClick(task: Task): void {
    detailStore.init(task.name);
    const path = approvalDetailPath.replace(':processInstanceID', task.processInstanceId)
      .replace(':taskID', task.taskId ?? task.id ?? '')
      .replace(':type', type);
    history.push(path);
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

  return (
    <div className='overflow-scroll flex flex-col'
      style={{ height: 'calc(100vh - 0.44rem - 0.42rem - 1px)' }}>
      <Filter key={props.type}
        filterKey={filterKey}
        type={props.type}
        filter={filter}
        show={!!filterShow}
        onClickCCReadAll={type === 'CC_PAGE' && store[storeType].readAllEnabled ? ccReadAll : undefined}
        onFilterClick={onFilterClick}/>
      <PullRefresh
        onRefresh={() => loadApprovals(1)}
        className='flex-1'>
        <List finished={store[storeType].finished}
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
      </PullRefresh>
    </div>
  );
};

export default observer(ApprovalsTab);

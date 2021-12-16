import React, { useState } from 'react';
import toast from '@lib/toast';
import { ApprovalsTabProps, Task } from '@m/pages/approvals/tab/types';
import { getFlowSummary } from '@m/lib/value-render';
import PullRefresh from '@m/qxp-ui-mobile/pull-refresh';
import TaskCard from '@m/components/task-card';
import List from '@m/qxp-ui-mobile/list';
import { Empty } from '@m/qxp-ui-mobile/empty';
import Filter from './filter';
import { NumberString } from '@m/qxp-ui-mobile';

const limit = 20;

export default function ApprovalsTab(props: ApprovalsTabProps): JSX.Element {
  const { request, filterKey, empty, tagType } = props;

  const [page, setPage] = useState(0);

  const [finished, setFinished] = useState(false);

  const [list, setList] = useState<Task[]>([]);

  const [inited, setInited] = useState(false);

  const [filterValue, setFilter] = useState<NumberString>('');

  async function loadApprovals(pageKey: number): Promise<void> {
    const params: Record<string, any> = { page: pageKey, limit, orderType: 'DESC' };
    if (filterKey && (filterValue || typeof filterValue === 'number')) {
      params[filterKey] = filterValue;
    }
    if (tagType) params.tagType = tagType;
    try {
      const res = await request(params);
      let data = res?.dataList;
      if (data && data.length > 0) {
        data = data.map((task) => {
          let taskResult: Task;
          if (task.flowInstanceEntity) {
            taskResult = { ...task, ...task.flowInstanceEntity, nodeName: task.name, taskId: task.id };
          } else {
            // Task aggregated
            taskResult = {
              ...task,
              nodeName: task.nodes ? task.nodes[0]?.taskName : undefined,
              taskId: undefined,
            };
          }
          const { formData, formSchema, keyFields } = taskResult;
          const summary: Array<string> = [];
          getFlowSummary(formData, formSchema, keyFields)?.forEach(((pair) => {
            if (pair.value) {
              summary.push(`${pair.key}：${pair.value}`);
            }
          }));
          taskResult.flowSummary = summary.join(' I ');
          return taskResult;
        });
      } else {
        data = [];
      }
      setPage(pageKey);
      setFinished(data.length < limit);
      data = data.filter((itm) => !itm.isDeleted);
      if (pageKey < 2) {
        setList(data);
      } else {
        setList(list.concat(data));
      }
    } catch (e) {
      toast.error(e);
    }
    if (!inited) setInited(true);
  }

  return (
    <div className='overflow-scroll flex flex-col'
      style={{ height: 'calc(100vh - 0.44rem - 0.42rem - 1px)' }}>
      <Filter key={props.type}
        filterKey={filterKey}
        type={props.type}
        onFilterChange={(key, value) => {
          setFilter(value);
          loadApprovals(1);
        }}/>
      <PullRefresh onRefresh={() => loadApprovals(1)} className='flex-1' style={{ padding: '0 .16rem' }}>
        <List finished={finished} onLoad={() => loadApprovals(page + 1)} className='h-full'>
          {list.length > 0 && (list.map((task) =>
            (<TaskCard
              key={task.id}
              task={task}
              type={props.type}
              className='mt-4 mb-8'/>
            )))
          }
          {list.length < 1 && inited && <Empty {...empty}/>}
        </List>
      </PullRefresh>
    </div>

  );
}

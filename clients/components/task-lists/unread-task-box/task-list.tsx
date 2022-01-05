import React, { useEffect, useState } from 'react';
import cs from 'classnames';

import Loading from '@c/loading';
import ws from '@lib/push';
import { getTaskList, deleteTask } from '@c/task-lists/api';

import TaskItem from './task-item';

interface Props {
  className?: string;
}

const NoTask = (): JSX.Element => (
  <div className='no-task'>
    <img className="w-4-dot-8 h-4-dot-8 mb-dot-6" src="/dist/images/alert.svg" alt="alert" />
    <span className="text-1-dot-2 text-blue-400">无任务列表</span>
  </div>
);

function TaskList({ className }: Props): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [taskList, setTaskList] = useState<Qxp.TaskItem[]>([]);

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    ws.addEventListener('entrepot-task', 'entrepot-task', (socketData) => {
      const { types, taskID, value } = socketData.content;
      if (types === 'ratio') {
        setTaskList(
          taskList.map((task) => {
            if (task.id === taskID) {
              return {
                ...task,
                ratio: value,
              };
            }
            return task;
          }),
        );
        return;
      }
      getTasks();
    });

    return () => {
      ws.removeEventListener('entrepot-task', 'entrepot-task');
    };
  }, [taskList]);

  const renderMain = (taskList: Qxp.TaskItem[]): JSX.Element => {
    if (!taskList.length) {
      return (
        <NoTask />
      );
    }

    return (
      <>
        {
          taskList.map((task: Qxp.TaskItem) => (
            <TaskItem task={task} key={task.id} deleteTaskItem={deleteTaskItem} />
          ))
        }
      </>
    );
  };

  function getTasks(): void {
    setLoading(true);
    getTaskList({ limit: 100, page: 1 }).then(setTaskList).finally(() => setLoading(false));
  }

  function deleteTaskItem(id: string): void {
    deleteTask(id).then(() => {
      setTaskList(taskList.filter((task) => task.id !== id));
    });
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={cs('task-list', className)}>
      {renderMain(taskList)}
    </div>
  );
}

export default TaskList;

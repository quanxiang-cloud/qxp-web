import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';

import store from '@home/pages/store';
import Divider from '@m/qxp-ui-mobile/divider';
import { spacer } from '@m/lib/ui-utils';
import { approvalsPath } from '@m/constant';
import { HomePageProps } from '../types';

import './index.scss';

function calcCount(count?: number): string {
  if (count) {
    return count > 99 ? '99+' : String(count);
  }
  return '0';
}

const TodoTaskCard: React.FC<HomePageProps> = (props) => {
  const history = useHistory();

  useEffect(() => {
    if (props.active) {
      store.fetchTodoList();
    }
  }, [props.active]);

  function renderItems(): JSX.Element[] | undefined {
    const todos = store.TODO_LIST.map(({ value, name, key }) =>
      (<div className='todo-task-card-item' key={key}
        onClick={() => {
          if (name === '已超时') {
            history.push(`${approvalsPath}?tagType=OVERTIME`);
          } else if (name === '催办') {
            history.push(`${approvalsPath}?tagType=URGE`);
          } else {
            history.push(approvalsPath);
          }
        }}
      >
        <p className="title1">{calcCount(value)}</p>
        <p className="body2 item-title">
          {name}
        </p>
      </div>
      ),
    );
    return spacer(
      todos,
      (i) => (<Divider
        key={`divider-${i}`}
        direction='vertical'
        color='var(--blue-400)'
        className='mt-72'
        size='.12rem'/>),
    );
  }

  return (
    <div className='todo-task-card'>
      <div className='flex'>
        {renderItems()}
      </div>
      <img src='/dist/images/mobile/bg_todo_task.svg' className='bg-card' alt=''/>
    </div>
  );
};

export default observer(TodoTaskCard);

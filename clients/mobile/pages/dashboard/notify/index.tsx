import React from 'react';
import { HomePageProps } from '../types';
import Header from '../header/header';
import TodoTaskCard from '../todo-task-card';
import store from '@home/pages/store';
import HomeCard from '../home-card';
import { useHistory } from 'react-router-dom';
import Icon from '@m/qxp-ui-mobile/icon';
import Badge from '@m/qxp-ui-mobile/badge';
import MessageCard from '@m/pages/msg-center/message-card';

const Notify: React.FC<HomePageProps> = (props) => {
  const history = useHistory();

  return (
    <Header active={props.active} key={props.key}>
      <div className='home-page-wrapper'>
        <TodoTaskCard active={props.active} />

        <HomeCard title='我的申请' className='mt-12'>
          <div className='my-apply-wrapper'>
            {store.HANDLE_LIST.map(({ name, key, icon, count, link }) => {
              return (
                <div
                  key={key}
                  className={'my-apply-item body1 text-secondary flex items-center'}
                  onClick={() => history.push(`/approvals?list=${link}`)}
                >
                  <Icon className="mr-8" name={icon} size='.24rem' addPrefix={true} />
                  <div className='flex-1 truncate mr-4'>{name}</div>
                  {(count !== undefined && count > 0 ) && (<Badge content={count} className='mr-4'/>)}
                  <Icon name="chevron_right" size='.16rem' />
                </div>
              );
            })}
          </div>
        </HomeCard>

        <MessageCard active={props.active} />
      </div>
    </Header>
  );
};

export default Notify;

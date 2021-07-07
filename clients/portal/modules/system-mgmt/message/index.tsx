import React, { useEffect, useRef, useState, useCallback } from 'react';
import msgMgmt from '@portal/stores/msg-mgmt';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import TextHeader from '@c/text-header';
import ErrorTips from '@c/error-tips';
import Search from '@c/search';
import Button from '@c/button';
import Container from '../container';
import MsgTable from './msg-table';
import Authorized from '@c/authorized';
import { useMsgInitData } from '../hooks';

import styles from './index.module.scss';

const useDebounceState = (defaultState: any, timer: number, cb?: (params: any) => void): [
  any, (newState: any) => void
] => {
  const [state, setState] = useState(defaultState);

  const ref = useRef<number>();

  const f = useCallback((newState) => {
    clearTimeout(ref.current);

    ref.current = window.setTimeout(() => {
      setState(newState);
      cb && cb(newState);
    }, timer);
  }, [setState, cb]);

  useEffect(() => {
    return (): void => clearTimeout(ref.current);
  }, []);

  return [state, f];
};

const MessagesPage = (): JSX.Element => {
  const history = useHistory();
  const {
    keyword: inputValue,
    pageInfo,
    setKeyword: setInputValue,
    setPageInfo,
  } = msgMgmt;
  useEffect(() => {
    document.title = '系统管理 - 消息管理';
  }, []);

  const [refresh] = useMsgInitData();

  const [_, searchValueChange] = useDebounceState(inputValue, 500, (newValue) => {
    setInputValue(newValue);
    setPageInfo({ ...pageInfo, current: 1 });
  });

  if (!window.ADMIN_USER_FUNC_TAGS.includes('platform')) {
    return (
      <ErrorTips
        style={{ marginTop: '200px' }}
        desc="您没有权限, 请联系管理员..."
      />
    );
  }

  const toSendMsg = (): void => {
    history.push('/system/message/send');
  };

  return (
    <Container>
      <div className="h-full flex flex-col flex-grow overflow-hidden">
        <TextHeader
          title="消息管理"
          desc="重要信息定向通知，全员播报"
          action="📖 了解消息管理"
          className="bg-gray-1000 px-20 py-16 header-background-image"
          itemTitleClassName="text-h5"
        />
        <div className="flex flex-col flex-grow overflow-hidden">
          <div className='w-full flex align-center ml-20 mt-20'>
            <Authorized authority={['system/mangage']}>
              <Button
                className="bg-gray-700 mr-20"
                // textClassName="text-white"
                modifier="primary"
                onClick={toSendMsg}
                iconName="add"
              >
              发送消息
              </Button>
            </Authorized>
            <Search
              placeholder="输入消息标题、操作人名称"
              value={inputValue}
              onChange={searchValueChange}
              className={styles.search}
            />
          </div>
          <div className="qxp-table my-20 px-20 w-full flex overflow-auto flex-col">
            <MsgTable refresh={refresh}/>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default observer(MessagesPage);

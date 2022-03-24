import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSearchParam } from 'react-use';
import { observer } from 'mobx-react';
import cs from 'classnames';

import NavPage from '@m/components/nav-page';
import Icon from '@m/qxp-ui-mobile/icon';
import Button from '@m/qxp-ui-mobile/button';
import Popup from '@m/qxp-ui-mobile/popup';
import Loading from '@m/qxp-ui-mobile/loading';

import store from './store';

import './index.scss';

function UserOrgPicker(): JSX.Element {
  const title = useSearchParam('title');
  const single = useSearchParam('single');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState<number>(1);
  const branchRef = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const state = history.location.state as { curPath: Location, userList: Array<string>};

  useEffect(() => {
    store.setCheckedUserList(state.userList || []);
    store.fetchAdminOrg();
  }, []);

  useEffect(() => {
    setPage(1);
    scrollToBottom();
    store.fetchUsers(1);
  }, [store.currentBranch.id]);

  useEffect(() => {
    page > 1 && store.fetchMoreUserList(page);
  }, [page]);

  useEffect(() => {
    !store.checkedUserList.length && setShowDialog(false);
  }, [store.checkedUserList]);

  useEffect(() => {
    store.searchUser(searchValue);
  }, [searchValue]);

  function scrollToBottom(): void {
    if (branchRef.current) {
      const scrollWidth = branchRef.current?.scrollWidth;
      const width = branchRef.current?.clientWidth;
      const maxScrollRight = scrollWidth - width;
      branchRef.current.scrollLeft = maxScrollRight > 0 ? maxScrollRight : 0;
    }
  }

  function handleScroll(): void {
    if (scrollRef.current) {
      const scrollHeight = scrollRef.current.scrollHeight;
      const clientHeight = scrollRef.current.clientHeight;
      const scrollTop = scrollRef.current.scrollTop;

      if (scrollHeight - scrollTop === clientHeight && store.total > store.userList.length) {
        setPage(page + 1);
      }
    }
  }

  return (
    <>
      <NavPage title={title || ''} className='w-full'>
        <div className='mx-16 mt-16 mb-8 search'>
          <Icon name='search' size='0.24rem'/>
          <input
            value={searchValue}
            placeholder='搜索员工姓名...'
            className='body1 text-primary search-input'
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
          {store.isSearch && (
            <div className='text-gray-400 mr-12' onClick={() => setSearchValue('')}>
              <Icon name='m-cancel' size='0.20rem' />
            </div>
          )}
        </div>
        {!store.isSearch && (
          <div className='branch-path text-highlight title3' ref={branchRef}>
            {store.branchPath.map((branchItem, index) => {
              return (
                <>
                  <div
                    key={branchItem.id}
                    className='mx-16'
                    onClick={() => store.changeCurOrg(branchItem, branchItem?.child)}
                  >
                    {branchItem.departmentName}
                  </div>
                  {index < store.branchPath.length - 1 && (
                    <div className='text-gray-300 w-16'>
                      <Icon name='keyboard_arrow_right' />
                    </div>
                  )}
                </>
              );
            })}
          </div>
        )}
        <div
          ref={scrollRef}
          onScrollCapture={() => handleScroll()}
          className='flex-1 overflow-scroll'
          style={{ height: store.isSearch ? 'calc(100vh - 1.75rem)' : 'calc(100vh - 2.20rem)' }}
        >
          {store.loading && <Loading className='top-1/2'/>}
          {!store.loading && (
            <>
              {store.curOrgList && store.curOrgList.length > 0 && (
                <>
                  {store.curOrgList.map((orgItem) => {
                    return (
                      <>
                        <div
                          key={orgItem.id}
                          className='org-item title3'
                          onClick={() => store.changeCurOrg(orgItem, orgItem?.child)}
                        >
                          <div className='ellipsis text-second'>{orgItem.departmentName}</div>
                          <Icon name='keyboard_arrow_right' />
                        </div>
                      </>
                    );
                  })}
                  <div className='bottom-line'></div>
                </>
              )}
              {store.userList && store.userList.length > 0 && store.userList.map(({ userName, id }) => {
                return (
                  <>
                    {single === 'true' && (
                      <div
                        key={id}
                        className='user-item'
                        onClick={() => !store.checkedUserList.includes(`${userName}_${id}`) &&
                        store.addSingleUserId(`${userName}_${id}`)}
                      >
                        <input
                          name='user'
                          type='radio'
                          className='w-18 h-18'
                          checked={store.checkedUserList[0] === `${userName}_${id}`}
                        />
                        <span className='user-item-name'>{userName}</span>
                      </div>
                    )}
                    {single === 'false' && (
                      <div
                        key={id}
                        className='user-item'
                        onClick={() => {
                          store.checkedUserList.find((user) => user === `${userName}_${id}`) ?
                            store.removeUserId(`${userName}_${id}`) : store.addUserId(`${userName}_${id}`);
                        } }
                      >
                        <input
                          type='checkbox'
                          className='w-18 h-18'
                          checked={!!store.checkedUserList.find((user) => user === `${userName}_${id}`)}
                        />
                        <span className='user-item-name'>{userName}</span>
                      </div>
                    )}
                  </>
                );
              })}
            </>
          )}
        </div>
        <div className={cs('confirm-wrapper', { 'confirm-wrapper-single': single === 'true' })}>
          <div
            className={cs('body1 text-highlight', {
              'hidden-item': single === 'true',
              'selected-counter__disabled': !store.checkedUserList.length,
            })}
            onClick={() => store.checkedUserList.length && setShowDialog(true)}
          >
                已选择({store.checkedUserList.length})个
          </div>
          <Button
            disabled={!store.checkedUserList.length}
            className={cs({ 'w-full': single === 'true' })}
            onClick={() => {
              history.goBack();
              history.replace(state.curPath.pathname + state.curPath.search, [...store.checkedUserList]);
            } }
          >
                确定({store.checkedUserList.length})
          </Button>
        </div>
      </NavPage>
      <Popup
        visible={showDialog}
        onClose={() => setShowDialog(false)}
        position="bottom"
        title={`已选择${store.checkedUserList.length || 0}个`}
        closeIcon='close'
        round
      >
        <div className='dialog-wrapper'>
          <div className='selected-user-wrapper'>
            {store.checkedUserList.map((user, index) => {
              return (
                <div key={user}>
                  <div className='selected-user-item' onClick={() => store.removeUserId(user)}>
                    <div>{user.split('_')[0]}</div>
                    <Icon name='delete' size='0.19rem'/>
                  </div>
                  {index < store.checkedUserList.length - 1 && (
                    <div className='bottom-line'></div>
                  )}
                </div>
              );
            })}
          </div>
          <Button
            className='btn-confirm-light'
            onClick={() => {
              history.goBack();
              history.replace(state.curPath.pathname + state.curPath.search, [...store.checkedUserList]);
            }}
          >确定</Button>
        </div>
      </Popup>
    </>
  );
}

export default observer(UserOrgPicker);

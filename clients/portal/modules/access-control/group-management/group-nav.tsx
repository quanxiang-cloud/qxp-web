import React, { useState, useEffect } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import Search from '@c/search';
import TwoLevelMenu from '@c/two-level-menu';
import MoreMenu from '@c/more-menu';
import Modal from '@c/modal';

import store, { DataGroup } from './store';
import { createDepartment, editDepartment } from '../departments-employees/api';
import toast from '@lib/toast';
import { delGroup } from './api';
import OperationConfirm from '@portal/modules/apps-management/pages/app-details/api-key/operation-confirm';

const regName = /^((?!(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])).)*$/;

function GroupNav(): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleVisible, setDeleVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [groupName, setGroupName] = useState<string>('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    errMsg && setErrMsg('');
  }, [groupName]);

  function handleClickMenu(key: string): void {
    if (key === 'edit') {
      setIsEdit(true);
      setIsVisible(true);
      return;
    }

    setDeleVisible(true);
  }

  function handleDelGroup(): void {
    delGroup(store.curGroupId).then(() => {
      store.fetchGroupMenus();
      setDeleVisible(false);
      toast.success('删除成员组成功');
    }).catch((err) => toast.error(err));
  }

  function handleAddGroup(): void {
    if (!groupName) {
      setErrMsg('请输入成员组名称');
      return;
    }

    if (!regName.test(groupName)) {
      setErrMsg('不能输入emoji表情符号');
      return;
    }

    if (store.validateTitleRepeat(groupName)) {
      setErrMsg('名称重复，请重新输入');
      return;
    }

    setSubmitting(true);
    if (isEdit && store.curGroupId) {
      editDepartment({ id: store.curGroupId, name: groupName, attr: 3 }).then(() => {
        store.fetchGroupMenus();
        setIsVisible(false);
        toast.success('修改成员组成功');
      }).catch((err) => toast.error(err)).finally(() => setSubmitting(false));

      return;
    }

    createDepartment({ pid: '', name: groupName, attr: 3 }).then(() => {
      store.fetchGroupMenus();
      setIsVisible(false);
      toast.success('新建成员组成功');
    }).catch((err) => toast.error(err)).finally(() => setSubmitting(false));
  }

  const moreMenus = [
    {
      key: 'edit',
      label: (
        <div className="flex items-center">
          <Icon name="edit" size={16} className="mr-8" />
          <span className="font-normal">修改分组名称</span>
        </div>
      ),
    },
    {
      key: 'delete',
      label: (
        <div className="flex items-center">
          <Icon name="restore_from_trash" size={16} className="mr-8" />
          <span className="font-normal">删除分组</span>
        </div>
      ),
    },
  ];

  return (
    <div className='flex flex-col border-r-1 group-nav py-16 bg-gray-50'>
      <div className='inline-flex items-center mb-8 text-12'>
        <Search
          placeholder='搜索分组'
          iconSize={16}
          className='group-search'
          onChange={store.searchGroups}
        />
        <div
          className='group-add'
          onClick={() => {
            setIsEdit(false);
            setIsVisible(true);
            setGroupName('');
          }}
        >
          <Icon name='add' type='light' className='flex-shrink-0' size={20} />
        </div>
      </div>
      <div className='flex-1 overflow-auto'>
        {!!store.groupNavMenus.length && (
          <TwoLevelMenu<DataGroup>
            menus={store.groupNavMenus}
            defaultSelected={store.curGroupId}
            actions={(node) => {
              return (
                <MoreMenu
                  menus={moreMenus}
                  onMenuClick={(key) => {
                    setGroupName(node.title);
                    handleClickMenu(key);
                  }}
                />
              );
            }}
            onSelect={(node) => {
              if (node.id === store.curGroupId) {
                return;
              }
              store.setCurGroupId(node.id);
            }}
          />
        )}
      </div>
      {deleVisible && (
        <Modal
          title="提示"
          onClose={() => setDeleVisible(false)}
          className="static-modal"
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              iconName: 'close',
              onClick: () => setDeleVisible(false),
            },
            {
              text: '确定',
              key: 'confirm',
              iconName: 'check',
              modifier: 'primary',
              onClick: () => handleDelGroup(),
            },
          ]}
        >
          {/* <p className="p-20">确定要删除分组吗？</p> */}
          <OperationConfirm message='删除' tips=''/>
        </Modal>
      )}
      {isVisible && (
        <Modal
          title="修改分组名称"
          onClose={() => setIsVisible(false)}
          className="static-modal"
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              iconName: 'close',
              onClick: () => setIsVisible(false),
            },
            {
              text: '确定',
              key: 'confirm',
              iconName: 'check',
              modifier: 'primary',
              loading: submitting,
              onClick: () => handleAddGroup(),
            },
          ]}
        >
          <div className='p-20'>
            <p>分组名称</p>
            <input
              value={groupName}
              className={cs('from-input', { error: errMsg })}
              placeholder='请输入'
              onChange={(e) => setGroupName(e.target.value)}
            />
            {errMsg && (<p className='text-red-400 text-12 mb-5'>{errMsg}</p>)}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default observer(GroupNav);

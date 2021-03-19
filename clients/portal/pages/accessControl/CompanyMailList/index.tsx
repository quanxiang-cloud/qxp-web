import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import { Control, Icon, Input } from '@QCFE/lego-ui';

import { TextHeader } from '@portal/components/TextHeader';
import { DepartmentStaff } from '@portal/components/DepartmentStaff';

import DepartmentsTree from './departments-tree';
import { Loading } from '@portal/components/Loading';
import { PersonInfo } from './PersonInfo';
import { getERPTree } from './api';

export interface IMailList {
  visible: boolean;
}

export const MailList = ({ visible }: IMailList) => {
  const [searchWord, setSearchWord] = useState<string>('');
  const [curDept, setCurrDept] = useState<DeptTree | ''>('');
  const [lastWord, setLastWord] = useState<string>('');

  const { data: rootDep, isLoading } = useQuery('getERPTree', () =>
    getERPTree().then((_treeData: any) => {
      setCurrDept(_treeData);
      return _treeData;
    })
  );

  const search = (keyWord: string) => {
    setSearchWord(keyWord);
  };

  function handleSearch(e: KeyboardEvent): void {
    if (e.key !== 'Enter') {
      return;
    }
    setLastWord(searchWord);
  }

  const handleClear = () => {
    search('');
    setLastWord('');
  };

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  const curDeptId = (curDept as DeptTree).id;

  return (
    <div
      className={twCascade('transition-opacity flex-column', {
        visible: visible,
        invisible: !visible,
        'opacity-0': !visible,
        'opacity-100': visible,
        'pointer-events-none': !visible,
        'pointer-events-auto': visible,
        'h-0': !visible,
        'h-full': visible,
        'overflow-hidden': !visible,
        'flex-none': !visible,
        'flex-1': visible,
      })}
    >
      <TextHeader
        title="企业通讯录"
        desc="管理账号，如添加、编辑、删除账号等，同时还能关联每个账号的角色；用户可用账号名称或邮件登录全象云平台。"
        action="📌 如何管理通讯录？"
        className="bg-F1F5F9-dot-5 px-4 py-dot-8 header-background-image"
      />
      <div className="h-full flex-column overflow-y-h">
        <div
          className={twCascade(
              'w-416 m-4 bg-F1F5F9 rounded-r-dot-6 rounded-tl-dot-2',
              'rounded-bl-dot-6 flex items-center',
          )}
        >
          <Control className="has-icons-left has-icons-right flex-1 control-set">
            <Icon className="is-left" name="magnifier" />
            <Input
              type="text"
              placeholder="搜索员工名称"
              name="search"
              onChange={(_: Event, value: string) => search(value)}
              value={searchWord}
              onKeyDown={handleSearch}
              onBlur={() => setLastWord(searchWord)}
            />
            {searchWord !== '' && (
              <Icon
                className="is-right"
                name="close"
                clickable
                onClick={handleClear}
              />
            )}
          </Control>
        </div>
        <div className="h-full mt-4 flex items-start overflow-y-h">
          <div className="w-12-dot-95 h-full">
            <DepartmentStaff department="组织架构" />
            <DepartmentsTree rootDep={rootDep} />
          </div>
          <div className="vertical-line flex-grow-0"></div>
          <PersonInfo
            keyword={lastWord}
            departmentId={curDeptId}
            departmentName={(curDept as DeptTree).departmentName}
          />
        </div>
      </div>
    </div>
  );
};

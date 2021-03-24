import React, { useState } from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import { Control, Icon, Input } from '@QCFE/lego-ui';

import { TextHeader } from '@portal/components/text-header';
import { DepartmentStaff } from '@portal/components/department-staff';

import DepartmentsTree from './departments-tree';
import { PersonInfo } from './person-info';

export default function MailList() {
  const [searchWord, setSearchWord] = useState<string>('');
  const [currentDepartment, setCurrentDepartment] = useState<IDepartment | null>(null);
  const [lastWord, setLastWord] = useState<string>('');

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

  return (
    <div className="transition-opacity flex-column flex-1">
      <TextHeader
        title="企业通讯录"
        desc="管理账号，如添加、编辑、删除账号等，同时还能关联每个账号的角色；用户可用账号名称或邮件登录全象云平台。"
        action="📌 如何管理通讯录？"
        className="bg-gray-200-dot-5 px-20 py-dot-8 header-background-image h-5-dot-6"
      />
      <div className="h-full flex-column overflow-y-h">
        <div
          className={twCascade(
            'w-416 ml-8 mt-8 bg-gray-200 rounded-r-dot-6 rounded-tl-dot-2',
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
          <div className="w-25-dot-9 h-full flex-col flex">
            <DepartmentStaff department="组织架构" />
            <DepartmentsTree onSelect={setCurrentDepartment} />
          </div>
          <div className="vertical-line flex-grow-0"></div>
          {
            currentDepartment && (
              <PersonInfo
                keyword={lastWord}
                departmentId={currentDepartment.id}
                handleClear={handleClear}
                departmentName={currentDepartment.departmentName}
              />
            )
          }
        </div>
      </div>
    </div>
  );
}

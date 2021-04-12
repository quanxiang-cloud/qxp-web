import React, { useState, useEffect } from 'react';

import TextHeader from '@c/text-header';
import Error from '@c/error';
import Search from '@c/search';
import notify from '@lib/notify';
import { usePortalGlobalValue } from '@portal/states_to_be_delete/portal';

import DepartmentsTree from './departments-tree';
import Employees from './employees';
import { SpecialSymbolsReg } from './utils';

export default function DepartmentsEmployees() {
  const [inputValue, setInputValue] = useState<string>('');
  const [searchWord, setSearchWord] = useState<string>('');
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [{ userInfo }] = usePortalGlobalValue();

  useEffect(() => {
    document.title = '访问控制 - 企业通讯录';
  }, []);

  function handleKeDown(e: React.KeyboardEvent): void {
    if (e.key !== 'Enter') {
      return;
    }
    if (SpecialSymbolsReg.test(inputValue)) {
      notify.error('不能输入特殊字符');
      return;
    }
    setSearchWord(inputValue);
  }

  function handleSelectDep(dep: Department) {
    setCurrentDepartment(dep);
    handleClear();
  }

  function handleClear() {
    setInputValue('');
    setSearchWord('');
  }

  function handleOnBlur(val: string) {
    const newVal = val === '' ? val : inputValue;
    if (SpecialSymbolsReg.test(newVal)) {
      notify.error('不能输入特殊字符');
      return;
    }
    setSearchWord(newVal);
  }

  if (!userInfo.authority.includes('accessControl/mailList/read')) {
    return (<Error desc="您没有权限, 请联系管理员..." />);
  }

  return (
    <div className="h-full flex flex-col flex-grow overflow-hidden">
      <TextHeader
        title='企业通讯录'
        desc="管理账号，如添加、编辑、删除账号等，同时还能关联每个账号的角色；用户可用账号名称或邮件登录全象云平台。"
        action="📌 如何管理通讯录？"
        className="bg-gray-1000 px-20 py-16 header-background-image"
        itemTitleClassName="text-h5"
      />
      <div className="h-full flex flex-col flex-grow overflow-hidden">
        <div className='w-208 ml-20 mt-20'>
          <Search
            placeholder="搜索员工名称"
            value={inputValue}
            onChange={(value: string) => setInputValue(value)}
            onKeyDown={handleKeDown}
            onBlur={handleOnBlur}
          />
        </div>
        <div className="h-full mt-20 flex overflow-hidden">
          <div className="h-full flex flex-col border-r w-259 overflow-hidden">
            <div className="text-h6 ml-20 mb-8">组织架构</div>
            <DepartmentsTree onSelect={handleSelectDep} />
          </div>
          {
            currentDepartment && (
              <Employees
                searchWord={searchWord}
                department={currentDepartment}
              />
            )
          }
        </div>
      </div>
    </div>
  );
}

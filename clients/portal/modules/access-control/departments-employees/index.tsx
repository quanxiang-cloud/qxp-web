import React, { useState, useEffect } from 'react';

import TextHeader from '@c/text-header';
import ErrorTips from '@c/error-tips';
import Search from '@c/search';
import toast from '@lib/toast';

import DepartmentsTree from './departments-tree';
import Employees from './employees';
import { SpecialSymbolsReg } from './utils';

export default function DepartmentsEmployees(): JSX.Element {
  const [inputValue, setInputValue] = useState<string>('');
  const [searchWord, setSearchWord] = useState<string>('');
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);

  useEffect(() => {
    document.title = '访问控制 - 企业通讯录';
  }, []);

  function handleKeDown(e: React.KeyboardEvent): void {
    if (e.key !== 'Enter') {
      return;
    }
    if (SpecialSymbolsReg.test(inputValue)) {
      toast.error('不能输入特殊字符');
      return;
    }
    setSearchWord(inputValue);
  }

  function handleSelectDep(dep: Department): void {
    setCurrentDepartment(dep);
    handleClear();
  }

  function handleClear(): void {
    setInputValue('');
    setSearchWord('');
  }

  function handleOnBlur(val: string): void {
    const newVal = val === '' ? val : inputValue;
    if (SpecialSymbolsReg.test(newVal)) {
      toast.error('不能输入特殊字符');
      return;
    }
    setSearchWord(newVal);
  }

  if (!window.ADMIN_USER_FUNC_TAGS.includes('accessControl/mailList/read')) {
    return (
      <ErrorTips
        style={{ marginTop: '200px' }}
        desc="您没有权限, 请联系管理员..."
      />
    );
  }

  return (
    <div className="h-full flex flex-col flex-grow  bg-white rounded-12" >
      <TextHeader
        title='企业通讯录'
        desc="管理账号，如添加、编辑、删除账号等，同时还能关联每个账号的角色；用户可用账号名称或邮件登录全象云平台。"
        // action="📌 如何管理通讯录？"
        className="bg-gray-1000 px-20 py-16 header-background-image"
        itemTitleClassName="text-h5"
      />
      <div className=" flex flex-col flex-grow" style={{
        height: 'calc(100% - 62px)',
      }}>
        <div className='w-208 ml-20 mt-20'>
          <Search
            className="bg-gray-100"
            placeholder="搜索员工名称"
            value={inputValue}
            onChange={(value: string): void => setInputValue(value)}
            onKeyDown={handleKeDown}
            onBlur={handleOnBlur}
          />
        </div>
        <div className="mt-20 flex overflow-hidden"
          style={{ height: 'calc(100% - 73px)' }} >
          <div className=" flex flex-col border-r min-w-259 overflow-auto">
            <div className="text-h6 ml-20 mb-8">组织架构</div>
            <DepartmentsTree onSelect={handleSelectDep}/>
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

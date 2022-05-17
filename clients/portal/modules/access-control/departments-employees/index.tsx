import React, { useState, useEffect } from 'react';

import TextHeader from '@c/text-header';
import ErrorTips from '@c/error-tips';
import Search from '@c/search';
import Boundary from '@c/boundary';
import toast from '@lib/toast';

import DepartmentsTree from './departments-tree';
import SearchOrganize from './search-organize';
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
    <div className="h-full flex flex-col flex-grow  bg-white" >
      <TextHeader
        title='企业通讯录'
        desc="管理账号，如添加、编辑、删除账号等，同时还能关联每个账号的角色；用户可用账号名称或邮件登录全象云平台。"
        className="bg-gray-1000 px-20 header-background-image border-b-1"
        itemTitleClassName="text-h5"
      />
      <div className=" flex flex-col flex-grow" style={{
        height: 'calc(100% - 62px)',
      }}>
        <Boundary
          items={[
            {
              key: 'left',
              defaultSpan: 20,
              content: (
                <div className='department-tree-wrapper h-full pt-16 border-r-1'>
                  <Search
                    className="mb-8"
                    placeholder="搜索名称..."
                    value={inputValue}
                    onChange={(value: string): void => setInputValue(value)}
                    onKeyDown={handleKeDown}
                    onBlur={handleOnBlur}
                  />
                  <div
                    className="flex flex-col overflow-auto"
                    style={{ height: 'calc(100% - 40px)' }}
                  >
                    {
                      searchWord ?
                        <SearchOrganize searchWord={searchWord} onChange={handleSelectDep} /> :
                        <DepartmentsTree onSelect={handleSelectDep}/>
                    }
                  </div>
                </div>
              ),
            },
            {
              key: 'right',
              defaultSpan: 80,
              content: (currentDepartment && (
                <Employees department={currentDepartment} />
              )),
            },
          ]}
        />
      </div>
    </div>
  );
}

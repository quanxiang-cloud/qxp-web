import React, { useState } from 'react';
import { useQuery } from 'react-query';
import classnames from 'classnames';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import { Select, Control, Icon, Input, Loading } from '@QCFE/lego-ui';
import XLSX from 'xlsx';

import { TextHeader } from '@portal/components/TextHeader';
import { DepartmentStaff } from '@portal/components/DepartmentStaff';
import { DepartmentTree } from './DepartmentTree';
import { PersonInfo } from './PersonInfo';

import { getERPTree } from './api';

export interface IMailList {
  visible: boolean;
}

export const MailList = ({ visible }: IMailList) => {
  const [searchWord, setSearchWord] = useState('');
  const [curDept, setCurrDept] = useState<DeptTree | ''>('');

  const { data, isLoading, refetch } = useQuery('getERPTree', () => getERPTree().then((_treeData: any) => {
    setCurrDept(_treeData)
    return _treeData
  }));

  const treeData: any[] = data ? [data] : [];

  function handleSearch(e: KeyboardEvent): void {
    if (e.key !== 'Enter') {
      return;
    }
  }

  const importExcel = (e: any) => {
    console.log(e);
    const files = e.target.files;
    console.log(files);

    const name = files.name;
    console.log(name);
    const reader = new FileReader();
    const jsondata: any[] = [];
    reader.onload = (evt: any) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      console.log(wb);
      const wsname = wb.SheetNames[0];
      console.log(wsname);
      const ws = wb.Sheets[wsname];
      console.log(ws);
      console.log(typeof ws);
      Object.keys(ws).forEach((key) => {
        const reg = /[A-Z][0-9]/;
        if (!reg.test(key)) {
          return;
        }
        const letter = key.substring(0, 1); // 字母
        const index = Number(key.substring(1, 2)); // 数字
        console.log(index);
        console.log(letter);
        if (index === 1) {
          return;
        }
        if (index > 2 && letter === 'A') {
          jsondata.push({
            key: key,
            name: ws[key].v,
          });
        }
        if (index > 2 && letter === 'B') {
          jsondata[jsondata.length - 1].phone = ws[key].v;
        }
        if (index > 2 && letter === 'C') {
          jsondata[jsondata.length - 1].email = ws[key].v;
        }
      });
      console.log(jsondata);
      // const data = XLSX.utils.sheet_to_csv(ws);
      // const json = XLSX.utils.sheet_to_json(ws);
    };
    reader.readAsBinaryString(files[0]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loading />
      </div>
    );
  }

  const curDeptId = (curDept as DeptTree).id;

  return (
    <div
      className={classnames('transition-opacity', 'flex-column', {
        visible: visible,
        invisible: !visible,
        'opacity-0': !visible,
        'opacity-100': visible,
        'pointer-events-none': !visible,
        'pointer-events-auto': visible,
        'h-0': !visible,
        'h-full': visible,
        'overflow-hidden': !visible,
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
          <Control className="has-icons-left flex-1 control-set">
            <Icon className="is-left" name="magnifier" />
            <Input
              type="text"
              placeholder="搜索员工名称、手机号、邮箱..."
              name="search"
              onChange={(_, value) => setSearchWord(value)}
              value={searchWord}
              onKeyDown={handleSearch}
            />
          </Control>
        </div>
        <div className="h-full mt-4 flex items-start overflow-y-h">
          <div className="w-12-dot-95 h-full">
            <DepartmentStaff department="部门人员" count={0} unit="部门" />
            <DepartmentTree treeData={treeData} setCurrDept={setCurrDept} departmentId={curDeptId} />
          </div>
          <div className="vertical-line flex-grow-0"></div>
          <PersonInfo departmentId={curDeptId} departmentName={curDept.departmentName} />
        </div>
      </div>
    </div>
  );
};

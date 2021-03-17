import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import useCss from 'react-use/lib/useCss';
import classnames from 'classnames';
import { Select, Control, Icon, Input, Dropdown, Loading } from '@QCFE/lego-ui';
import XLSX from 'xlsx';

import { TextHeader } from '@portal/components/TextHeader';
import { DepartmentStaff } from '@portal/components/DepartmentStaff';
import { DepartmentTree } from './DepartmentTree';
import { ActionsList, IActionListItem } from '@portal/components/ActionsList';
import { Button } from '@portal/components/Button';
import { PersonInfo } from './PersonInfo';
import { ExportFileModal } from './ExportFileModal';
import { StaffModal } from './StaffModal';
import { SelectCheckbox } from '@portal/components/SelectCheckbox';

import { getERPTree, addDepUser } from './api';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import { FormValues } from './StaffModal';
export interface IMailList {
  visible: boolean;
}

export const MailList = ({ visible }: IMailList) => {
  const { data, isLoading, refetch } = useQuery('getERPTree', getERPTree);
  const [selectedValue, changeSelectedValue] = useState('CentOS');
  const [inputValue, changeInputValue] = useState('');
  const [visibleFile, setVisibleFile] = useState(false);
  const [visibleStaff, setVisibleStaff] = useState(false);
  const [currDepId, setCurrDepId] = useState(''); // 部门ID

  const mutation = useMutation(addDepUser, {
    onSuccess: () => {
      setVisibleStaff(false);
      refetch();
    },
  });

  const treeData: any[] = data ? [data] : [];

  const actions: IActionListItem<null>[] = [
    {
      id: '1',
      iconName: 'exprt',
      text: '导出员工数据 ',
    },
  ];

  // 打开文件模态框
  const importFile = () => {
    setVisibleFile(true);
  };

  // 关闭文件模态框
  const closeFileModal = () => {
    setVisibleFile(false);
  };

  const importExcel = (e: any) => {
    console.log(e);
    const files = e.target.files;
    console.log(files);

    const name = files.name;
    console.log(name);
    const reader = new FileReader();
    const jsondata: any[] = [];
    // [{
    //   key: 'A3',
    //   name: "",
    //   reason: ""
    // }]
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

  // 新增员工
  const openStaffModal = () => {
    setVisibleStaff(true);
  };

  const closeStaffModal = () => {
    setVisibleStaff(false);
  };

  const okStaffModal = (values: FormValues) => {
    mutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loading />
      </div>
    );
  }

  return (
    <div
      className={classnames('transition-opacity', {
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
      {/* <input type="file" id="excel-file" onChange={importExcel} /> */}
      {/* 员工模态框 */}
      {visibleStaff && (
        <StaffModal
          visible={visibleStaff}
          status="add"
          okModal={okStaffModal}
          closeModal={closeStaffModal}
        />
      )}
      {/* 文件处理模态框 */}
      {visibleFile && (
        <ExportFileModal
          visible={visibleFile}
          okModal={closeFileModal}
          closeModal={closeFileModal}
        />
      )}
      <TextHeader
        title="企业通讯录"
        desc="管理账号，如添加、编辑、删除账号等，同时还能关联每个账号的角色；用户可用账号名称或邮件登录全象云平台。"
        action="📌 如何管理通讯录？"
        className="bg-F1F5F9-dot-5 px-4 py-dot-8 header-background-image"
      />
      <div className="h-full">
        <div
          className={twCascade(
            'w-416 m-4 bg-F1F5F9 rounded-r-dot-6 rounded-tl-dot-2',
            'rounded-bl-dot-6 flex items-center',
          )}
        >
          <Select
            name="os"
            // className={useCss({
            //   '&:hover': {
            //     border: 'none',
            //     background: 'none',
            //   },
            //   '.select-control': {
            //     background: 'none',
            //     border: 'none',
            //   },
            //   '&': {
            //     width: '5.3rem',
            //     border: 'none',
            //     background: 'none !important',
            //   },
            //   '.select-value-label': {
            //     'font-size': '14px',
            //   },
            // })}
            value={selectedValue}
            options={[
              { value: 'CentOS', label: '按员工' },
              { value: 'Debian', label: '按部门' },
              { value: 'Ubuntu', label: '按邮箱' },
            ]}
          />
          <Control
            className={classnames(
              'has-icons-left flex-1',
              // useCss({
              //   '> input': {
              //     background: 'none',
              //     border: 'none',
              //     outline: 'none',
              //   },
              // }),
            )}
          >
            <Icon className="is-left" name="magnifier" />
            <Input
              type="text"
              placeholder="搜索员工名称、手机号、邮箱..."
              name="search"
              // onChange={changeInputValue}
              value={inputValue}
            />
          </Control>
        </div>
        <div className="h-full mt-4 flex items-start">
          <div className="w-12-dot-95 h-full">
            <DepartmentStaff department="部门人员" count={0} unit="部门" />
            <DepartmentTree treeData={treeData} setCurrDepId={setCurrDepId} />
          </div>
          <div className="vertical-line flex-grow-0"></div>
          <div className="flex-1 h-full">
            <DepartmentStaff department="全象应用平台" count={1} unit="人" />
            <div className="px-4 my-2">
              <div className="flex items-center">
                <Button
                  className="bg-black"
                  textClassName="text-white"
                  icon={
                    <svg
                      className="mr-dot-4"
                      width="18"
                      height="14"
                      viewBox="0 0 18 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.6667 1.99998H9.00008L7.33342 0.333313H2.33341C1.40841 0.333313 0.675081 1.07498 0.675081 1.99998L0.666748 12C0.666748 12.925 1.40841 13.6666 2.33341 13.6666H15.6667C16.5917 13.6666 17.3334 12.925 17.3334 12V3.66665C17.3334 2.74165 16.5917 1.99998 15.6667 1.99998ZM15.6667 12H2.33341V1.99998H6.64175L8.30841 3.66665H15.6667V12ZM9.00008 8.66665H10.6667V10.3333H12.3334V8.66665H14.0001V6.99998H12.3334V5.33331H10.6667V6.99998H9.00008V8.66665Z"
                        fill="white"
                      />
                    </svg>
                  }
                  onClick={importFile}
                >
                  excel 批量导入
                </Button>
                <div className="px-2"></div>
                <Button icon={<Icon className="mr-dot-4" name="add" />} onClick={openStaffModal}>
                  添加员工
                </Button>
                <div className="px-2"></div>
                <Dropdown content={<ActionsList actions={actions} />}>
                  <div>
                    <Button className="bg-black" textClassName="text-white">
                      ···
                    </Button>
                  </div>
                </Dropdown>
              </div>
              <PersonInfo departmentId={currDepId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

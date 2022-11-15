import React, { useState, useEffect } from 'react';
import { UnionColumn } from 'react-table';
import { useParams } from 'react-router-dom';

import toast from '@lib/toast';
import PopConfirm from '@c/pop-confirm';
import Button from '@c/button';
import Table from '@c/table';
import Pagination from '@c/pagination';
import EmployeeOrDepartmentPickerModal from '@c/employee-or-department-picker';
import Modal from '@c/modal';

import { addAppMembers, deleteAppMembers, getAppVisitPermission } from '../api';
import { getTwoDimenArrayHead } from '@lib/utils';
import { getERPTree } from '@portal/modules/access-control/departments-employees/api';
import RadioButtonGroup from '@c/radio/radio-button-group';

function AppVisitPermission(): JSX.Element {
  const [modalType, setModalType] = useState<'addMember' | 'confirmRemoveMember' | ''>('');
  const [selectedIdArr, setSelectedArr] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const { appID } = useParams<{ appID: string }>();
  const [members, setMembers] = useState<Array<Employee>>([]);
  const [pagination, setPagination] = useState({ page: 1, size: 10 });
  const [totalMembers, setTotal] = useState(0);
  const [departments, setDepartments] = useState<any>([]);
  const [employees, setEmployees] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [showBindType, setShowBindType] = useState<number>(1);

  useEffect(() => {
    fetchMembers();
    fetchTree();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [pagination]);

  useEffect(()=>{
    getAppVisitPermission(appID, pagination.page, totalMembers || 1000).then(({ members, total, list }) => {
      const treeList = treeToList(treeData);
      const depart: any = [];
      const employee: any = [];
      treeList.map((item: any)=>{
        list.map((_item: { scopeID: any; })=>{
          if (item.id === _item.scopeID) {
            depart.push({
              id: item.id,
              ownerID: item.id,
              ownerName: item.name,
              type: 2,
            });
          }
        });
      });
      setDepartments([...new Set(depart)]);

      members.map((item: any)=>{
        employee.push({
          id: item.id,
          ownerID: item.id,
          ownerName: item.name,
          type: 1,
        });
      });
      setEmployees(employee);
    });
  }, [totalMembers]);

  function treeToList(obj: any): any {
    const res: any = [];
    function a(obj: any): any {
      res.push({ ...obj });
      if (obj.child) {
        for (const v of obj.child) {
          a(v);
        }
      }
    }
    a(obj);
    return res;
  }

  function fetchTree(): void {
    getERPTree().then((_treeData: any) => {
      setTreeData(_treeData);
    });
  }

  function fetchMembers(): void {
    setLoading(true);
    getAppVisitPermission(appID, pagination.page, pagination.size).then(({ members, total }) => {
      setLoading(false);
      setMembers(members);
      setTotal(total);
    });
  }

  function removeMembers(idArr: string[]): Promise<void> {
    setDelLoading(true);
    return deleteAppMembers(appID, idArr).then(() => {
      setDelLoading(false);
      fetchMembers();
      toast.success('删除成功！');
    });
  }

  const batchRemove = (): void => {
    removeMembers(selectedIdArr).then(() => {
      setModalType('');
    });
  };

  const handleSelectChange = (selectedArr: string[]): void => {
    setSelectedArr(selectedArr);
  };

  async function handleAdd(
    _: EmployeeOrDepartmentOfRole[],
    selected: EmployeeOrDepartmentOfRole[],
  ): Promise<void> {
    if (selected.length === 0 && _.length === 0 && members.length === 0) {
      toast.error('请选择要添加的成员');
      return;
    }
    return addAppMembers(
      appID,
      [...selected.map(({ id }) =>
        ({ scopeID: id, type: 'user' })), ..._.map(({ id }) => ({ scopeID: id, type: 'department' }))],
    ).then(() => {
      fetchMembers();
      setModalType('');
    });
  }

  async function handleDeptRemove(data: any): Promise<void> {
    return deleteAppMembers(appID, [data.id]).then(() => {
      setDepartments([...departments.filter((item: any)=>item.id !== data.id)]);
      setEmployees([...employees.filter((item: any)=>item.id !== data.id)]);
      fetchMembers();
      // toast.success('删除成功！');
    });
  }
  const columns: UnionColumn<Employee>[] = React.useMemo(
    () => [
      {
        id: 'name',
        Header: '员工',
        accessor: 'name',
      },
      {
        id: 'phone',
        Header: '手机号',
        accessor: 'phone',
      },
      {
        id: 'email',
        Header: '邮箱',
        accessor: 'email',
      },
      {
        id: 'dep',
        Header: '部门',
        accessor: ({ deps }) => {
          const dep = getTwoDimenArrayHead(deps);
          return dep?.name || '未分配部门';
        },
      },
      {
        id: 'action',
        Header: '操作',
        accessor: ({ id }: { id: string }): JSX.Element => (
          <PopConfirm onOk={() => removeMembers([id])} content={<span>确认移除成员吗？</span>}>
            <span className="text-btn">移除</span>
          </PopConfirm>
        ),
      },
    ],
    [],
  );

  const deptColumns = React.useMemo(
    () => [
      {
        id: 'dep',
        Header: '部门',
        accessor: (data: any) => {
          return data?.ownerName;
        },
      },
      {
        id: 'action',
        Header: '操作',
        accessor: ({ id }: { id: string }): JSX.Element => (
          <PopConfirm onOk={() => removeMembers([id])} content={<span>确认移除部门吗？</span>}>
            <span className="text-btn">移除</span>
          </PopConfirm>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <div className="flex-1 py-16">
        <div className='app-visit-permission btn-wrap'>
          <div >
            {!!selectedIdArr.length && (
              <Button
                className="ml-16"
                onClick={() => setModalType('confirmRemoveMember')}
                modifier="primary"
                iconName="restore_from_trash"
              >
            批量移除
              </Button>
            )}
            <Button
              onClick={() => setModalType('addMember')}
              className="ml-16"
              modifier="primary"
              iconName="add"
              textClassName="text-12 py-6"
            >
          添加成员
            </Button>
          </div>

          <RadioButtonGroup
            className="mr-16 text-12"
            radioBtnClass="bg-white"
            currentValue={showBindType + ''}
            listData={[
              {
                label: '员工',
                value: '1',
              }, {
                label: '部门',
                value: '2',
              },
            ]}
            onChange={(value) => setShowBindType(Number(value))}
          />
        </div>

        <div className="bg-white px-16 py-8 rounded-12">
          <Table
            showCheckbox
            rowKey="id"
            style={{ maxHeight: 'calc(100vh - 300px)' }}
            columns={(showBindType === 1) ? columns : deptColumns as any}
            data={(showBindType === 1) ? members : departments as any}
            loading={loading}
            className="text-12"
            onSelectChange={handleSelectChange}
          />
          <Pagination
            pageSize={pagination.size}
            current={pagination.page}
            total={(showBindType === 1) ? employees.length : departments.length }
            onChange={(current, pageSize) => {
              setPagination({ size: pageSize, page: current });
            }}
          />
        </div>
        {modalType === 'confirmRemoveMember' && (
          <Modal
            title="批量移除"
            onClose={() => setModalType('')}
            footerBtns={[
              {
                text: '取消',
                key: 'cancel',
                iconName: 'close',
                onClick: () => setModalType(''),
              },
              {
                text: '确定移除',
                key: 'confirm',
                iconName: 'check',
                loading: delLoading,
                modifier: 'primary',
                onClick: batchRemove,
              },
            ]}
          >
            <p className="p-20">确定要批量移除成员吗？</p>
          </Modal>
        )}
        {modalType === 'addMember' && (
          <EmployeeOrDepartmentPickerModal
            // onlyEmployees
            textHeaderDesc={' '}
            title="添加可访问成员"
            submitText="添加"
            employees={employees as EmployeeOrDepartmentOfRole[]}
            departments={departments as EmployeeOrDepartmentOfRole[]}
            onSubmit={handleAdd}
            onDeptRemove={handleDeptRemove}
            onCancel={() => setModalType('')}
          />
        )}
      </div>
    </>
  );
}

export default AppVisitPermission;

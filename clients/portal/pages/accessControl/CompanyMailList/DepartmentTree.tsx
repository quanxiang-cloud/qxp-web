import React, { useState } from 'react';
import { useQuery } from 'react-query';
import useCss from 'react-use/lib/useCss';
import { Tree, TreeNode, Dropdown } from '@QCFE/lego-ui';

import { ActionsList, IActionListItem } from '@portal/components/ActionsList';
import { DepartmentModal } from './DepartmentModal';
import { DeleteModal } from './DeleteModal';

import { deleteDEP } from './api';

export interface TreeNodeItem extends ITreeNode {
  addDepartment: (val: string, id: string) => void;
}

const Title = (titleProps: TreeNodeItem) => {
  const { departmentName, id, pid, addDepartment } = titleProps;

  const [handleStatus, setHandleStatus] = useState<'add' | 'edit'>('add');
  const [visibleDepartment, setVisibleDepartment] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [indexOfNode, setIndexOfNode] = useState(id); // 记录当前点击树节点的id
  const [checkedDep, setCheckDep] = useState<TreeNodeItem | Partial<TreeNodeItem>>();

  const { refetch } = useQuery(
    'deleteDEP',
    () => deleteDEP(checkedDep && checkedDep.id ? checkedDep.id : ''),
    {
      refetchOnWindowFocus: false,
      enabled: false,
    },
  );
  // 添加部门 or 修改部门
  const handleDepartment = (
    status: 'add' | 'edit',
    params?: TreeNodeItem | Partial<TreeNodeItem>,
  ) => {
    setVisibleDepartment(true);
    setHandleStatus(status);
    console.log('id', params);
  };

  //  关闭部门模态框
  const closeDepartmentModal = () => {
    setVisibleDepartment(false);
  };

  //  确定添加部门处理函数
  const okDepartmentModal = (val: any, nodeIndex: string) => {
    // setIndexOfNode(nodeIndex); // 更新当前点击树节点的id
    // addDepartment(val['department-name'], nodeIndex); // 将新增部门添加为当前点击树节点的子节点
    setVisibleDepartment(false);
  };

  // 删除部门
  const deleteDepartment = (params?: TreeNodeItem | Partial<TreeNodeItem>) => {
    setCheckDep(params);
    setVisibleDelete(true);
  };

  // 关闭删除弹窗
  const closeDeleteModal = () => {
    setVisibleDelete(false);
    refetch();
  };

  const actions = (bol: boolean) => {
    const acts = [
      {
        id: '1',
        iconName: './dist/images/add-department.svg',
        text: '添加部门',
        onclick: (params?: TreeNodeItem | Partial<TreeNodeItem>) => handleDepartment('add', params),
      },
      {
        id: '2',
        iconName: './dist/images/edit.svg',
        text: '修改部门',
        onclick: (params?: TreeNodeItem | Partial<TreeNodeItem>) =>
          handleDepartment('edit', params),
      },
    ];
    if (bol) {
      acts.push({
        id: '3',
        iconName: './dist/images/delete.svg',
        text: '删除',
        onclick: (params?: TreeNodeItem | Partial<TreeNodeItem>) => deleteDepartment(params),
      });
    }
    return acts;
  };

  return (
    <>
      {/* 部门模态框 */}
      {visibleDepartment && (
        <DepartmentModal
          visible={visibleDepartment}
          status={handleStatus}
          nodeId={indexOfNode}
          closeModal={closeDepartmentModal}
          okModal={okDepartmentModal}
        />
      )}
      {/* 删除模态框 */}
      {visibleDelete && (
        <DeleteModal
          visible={visibleDelete}
          closeModal={closeDeleteModal}
          okModal={closeDeleteModal}
        />
      )}
      <div className="w-full flex items-center justify-between">
        <div className="text-dot-7">{departmentName}</div>
        <div className="h-auto relative">
          <Dropdown
            content={
              <ActionsList<TreeNodeItem>
                actions={actions(pid ? true : false)}
                params={{
                  id,
                  departmentName,
                  pid,
                }}
              />
            }
          >
            <span>...</span>
          </Dropdown>
        </div>
      </div>
    </>
  );
};

export interface ITreeNode {
  id: string;
  departmentName: string;
  departmentLeaderId: string;
  useStatus: number;
  superId: string;
  child: ITreeNode[];
  pid?: string;
}

interface DepartmentTreeProps {
  treeData: ITreeNode[];
}

export const DepartmentTree = (props: DepartmentTreeProps) => {
  return <></>;
};

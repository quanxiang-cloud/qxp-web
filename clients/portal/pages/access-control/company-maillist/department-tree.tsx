import React, { useState } from 'react';
import cs from 'classnames';
import { useQueryClient } from 'react-query';
import useCss from 'react-use/lib/useCss';
import { Tree, TreeNode, Dropdown, Message } from '@QCFE/lego-ui';

import { List, IITems } from '@c/list2';
import DepartmentModal from './department-modal';
import { DeleteModal } from './delete-modal';
import { deleteDEP } from '@net/corporate-directory';

export interface TreeNodeItem extends ITreeNode {
  addDepartment: (val: string, id: string) => void;
  openDeptModal: (type: string, deptInfo?: Partial<DeptInfo>) => void;
  openDeleteDeptModal: (deptInfo?: Partial<DeptInfo>) => void;
  onSelect: (deptInfo: any) => void;
}

const Title = ({ openDeptModal, openDeleteDeptModal, onSelect, ...treenode }: TreeNodeItem) => {
  const actions = (bol: boolean) => {
    const acts: IITems<DeptInfo> = [
      {
        id: '1',
        iconName: 'network-router',
        text: '添加部门',
        onclick: (params?: DeptInfo) => openDeptModal('add', params),
      },
      {
        id: '2',
        iconName: 'pen',
        text: '修改部门',
        onclick: (params?: DeptInfo) => openDeptModal('edit', params),
      },
    ];
    if (bol) {
      acts.push({
        id: '3',
        iconName: 'trash',
        text: '删除',
        onclick: (params?: Partial<DeptInfo>) => openDeleteDeptModal(params),
      });
    }
    return acts;
  };

  const { departmentName, id, pid } = treenode;

  return (
    <>
      <div className={cs('w-full h-full flex items-center justify-between')}>
        <div
          onClick={() => onSelect(treenode)}
          className="text-14 h-full truncate flex items-center"
        >
          {departmentName}
        </div>
        <div className="h-auto relative">
          <Dropdown
            content={
              <List<{ id: string, departmentName: string, pid?: string }>
                items={actions(pid ? true : false)}
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
  setShowDept: (treeNode: DeptTree) => void;
  departmentId: string;
}

export const DepartmentTree = ({ departmentId, treeData, setShowDept }: DepartmentTreeProps) => {
  const [modalType, setModalType] = useState('');
  const [curDept, setCurDept] = useState<TreeNodeItem | null>(null);
  const [deptModalType, setDeptModalType] = useState<'add' | 'edit'>('add');
  const client = useQueryClient();

  const closeModal = () => {
    setCurDept(null);
    setModalType('');
  };

  const openDeptModal = (type: 'add' | 'edit', params: TreeNodeItem) => {
    setDeptModalType(type);
    setCurDept(params);
    setModalType('department');
  };

  const openDeleteDeptModal = (params: TreeNodeItem) => {
    setCurDept(params);
    setModalType('delDept');
  };

  const onSelect = (treeNode: DeptTree) => {
    setShowDept(treeNode);
  };

  const renderTreeNodes = (childData: ITreeNode[]) =>
    childData.length > 0 &&
    childData.map((treenode: any) => {
      const { child } = treenode;
      if (child) {
        return (
          <TreeNode
            title={
              <Title
                {...treenode}
                onSelect={onSelect}
                openDeptModal={openDeptModal}
                openDeleteDeptModal={openDeleteDeptModal}
              />
            }
            key={treenode.id}
            dataRef={treenode}
          >
            {renderTreeNodes(child)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={
            <Title
              {...treenode}
              onSelect={onSelect}
              openDeptModal={openDeptModal}
              openDeleteDeptModal={openDeleteDeptModal}
            />
          }
          key={treenode.id}
          dataRef={treenode}
        />
      );
    });

  const deleteDept = () => {
    deleteDEP((curDept as TreeNodeItem).id).then((res) => {
      if (res && res.code === 0) {
        closeModal();
        client.invalidateQueries('getERPTree');
      } else {
        closeModal();
        Message.error(
          `${
            curDept && curDept.departmentName
          }部门中已存在员工数据，请先移除该部门下的所有员工数据。`,
        );
      }
    });
  };

  return (
    <div className="w-auto h-full">
      <Tree
        defaultExpandAll
        defaultSelectedKeys={[departmentId]}
        className={useCss({
          '.tree-title': {
            width: '100%',
            height: '100%',
          },
          '.tree-node-wrap': {
            height: '2.7rem',
            padding: '0 1rem',
          },
          '&': {
            'li.tree-node .tree-node-wrap:hover:before': {
              height: '2.7rem',
              'background-color': 'var(--blue-100)',
              opacity: '0.5',
            },
            'li.tree-node .tree-node-wrap.tree-node-wrap-selected:before': {
              height: '2.7rem',
              'background-color': 'var(--blue-100)',
              opacity: '1',
            },
            'li.tree-node .tree-node-wrap.tree-node-wrap-selected .tree-title': {
              '> div > .text-14': {
                color: '#375FF3',
              },
              '.text-14': {
                'font-weight': 'normal',
              },
            },
            'li.tree-node span.tree-switcher:hover': {
              background: 'none',
            },
            'li.tree-node .tree-node-content-wrapper': {
              width: '100%',
            },
          },
        })}
      >
        {treeData.length > 0 ? renderTreeNodes(treeData) : null}
      </Tree>
      {modalType === 'department' && (
        <DepartmentModal
          deptModalType={deptModalType}
          department={curDept as DeptInfo}
          closeModal={closeModal}
        />
      )}
      {modalType === 'delDept' && (
        <DeleteModal currDep={curDept} closeModal={closeModal} okModal={deleteDept} />
      )}
    </div>
  );
};

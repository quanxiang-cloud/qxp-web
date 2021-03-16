import React, { useState } from 'react';
import { useQuery } from 'react-query';
import useCss from 'react-use/lib/useCss';
import { Tree, TreeNode, Dropdown } from '@QCFE/lego-ui';

import { ActionsList, IActionListItem } from '@portal/components/ActionsList';
import { DepartmentModal } from './DepartmentModal';
import { DeleteModal } from './DeleteModal';

import { deleteDEP } from './api';

interface TreeNodeItem extends ITreeNode {
  addDepartment: (val: string, id: string) => void;
}

const Title = (titleProps: TreeNodeItem) => {
  const { departmentName, id, pid, addDepartment } = titleProps;

  const [handleStatus, setHandleStatus] = useState<'add' | 'edit'>('add');
  const [visibleDepartment, setVisibleDepartment] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [indexOfNode, setIndexOfNode] = useState(id); // 记录当前点击树节点的id
  const [checkedDep, setCheckDep] = useState<TreeNodeItem>(null);

  const { refetch } = useQuery('deleteDEP', () => deleteDEP(checkedDep ? checkedDep.id : ''), {
    refetchOnWindowFocus: false,
    enabled: false,
  });
  // 添加部门 or 修改部门
  const handleDepartment = (status: 'add' | 'edit', params: TreeNodeItem) => {
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
  const deleteDepartment = (params: TreeNodeItem) => {
    setCheckDep(params);
    setVisibleDelete(true);
  };

  // 关闭删除弹窗
  const closeDeleteModal = () => {
    setVisibleDelete(false);
    refetch();
  };

  const actions = (bol: boolean) => {
    console.log(bol);
    return [
      {
        id: '1',
        iconName: './dist/images/add-department.svg',
        text: '添加部门',
        onclick: (params: TreeNodeItem) => handleDepartment('add', params),
      },
      {
        id: '2',
        iconName: './dist/images/edit.svg',
        text: '修改部门',
        onclick: (params: TreeNodeItem) => handleDepartment('edit', params),
      },
      bol && {
        id: '3',
        iconName: './dist/images/delete.svg',
        text: '删除',
        onclick: (params: TreeNodeItem) => deleteDepartment(params),
      },
    ];
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
              <ActionsList<string>
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

interface ITreeNode {
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
  const { treeData } = props;

  // 添加部门节点数据
  const addHandle = (val: string, id: string) => {
    // const data = treeData.slice()
    // const i = id.split('-').map((item) => {
    //   return Number(item) - 1
    // })
    // switch (i.length) {
    //   case 2:
    //     data[i[0]].children[i[1]].children.push({
    //       title: val,
    //       id: id + '-' + (data[i[0]].children[i[1]].children.length + 1).toString(),
    //       key: id + '-' + (data[i[0]].children[i[1]].children.length + 1).toString(),
    //     })
    //     break
    //   case 1:
    //     data[i[0]].children.push({
    //       title: val,
    //       id: id + '-' + (data[i[0]].children.length + 1).toString(),
    //       key: id + '-' + (data[i[0]].children.length + 1).toString(),
    //       children: [],
    //     })
    //     break
    //   default:
    //     break
    // }
    // 更新treeData的状态
    // setTreeData(data)
  };

  const renderTreeNodes = (childData: ITreeNode[]) =>
    childData.length > 0 &&
    childData.map((treenode: any) => {
      const { child } = treenode;
      if (child) {
        return (
          <TreeNode
            title={<Title {...treenode} addDepartment={addHandle} />}
            key={treenode.id}
            dataRef={treenode}
          >
            {renderTreeNodes(child)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={<Title {...treenode} addDepartment={addHandle} />}
          key={treenode.id}
          dataRef={treenode}
        />
      );
    });

  const onSelect = (keys: string[], e: React.MouseEvent) => {
    console.log(keys);
    console.log(e);
    if (keys && keys.length > 0) {
      const checkId: string = keys[0];
    }
  };

  return (
    <div className="w-auto h-full">
      <Tree
        defaultExpandAll
        onSelect={onSelect}
        className={useCss({
          '.tree-title': {
            width: '100%',
          },
          '.tree-node-wrap': {
            height: '2.7rem',
            padding: '0 1rem',
          },
          '&': {
            'li.tree-node .tree-node-wrap:hover:before': {
              height: '2.7rem',
              'background-color': '#F0F6FF',
              opacity: '0.5',
            },
            'li.tree-node .tree-node-wrap.tree-node-wrap-selected:before': {
              height: '2.7rem',
              'background-color': '#F0F6FF',
              opacity: '1',
            },
            'li.tree-node .tree-node-wrap.tree-node-wrap-selected .tree-title': {
              '> div > .text-dot-7': {
                color: '#375FF3',
              },
              '.text-dot-7': {
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
    </div>
  );
};

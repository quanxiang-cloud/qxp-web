import React, { useState } from 'react'
import useCss from 'react-use/lib/useCss'
import classnames from 'classnames'
import { Tree, TreeNode, Dropdown, Menu } from '@QCFE/lego-ui'

const { SubMenu, MenuItem } = Menu;

interface TreeNodeItem {
  title: string
  [propsName: string]: string
}

const ActionsList = () => {

  const actions = [
    {
      id: '1',
      icon: './dist/images/add-department.svg',
      text: '添加部门'
    },
    {
      id: '2',
      icon: './dist/images/edit.svg',
      text: '修改信息'
    },
    {
      id: '3',
      icon: './dist/images/delete.svg',
      text: '删除'
    },
  ];

  return (
    <div className="w-24 z-10 py-dot-8 shadow-title bg-white rounded-dot-6 absolute top-1-dot-6 right-0">
      <ul className="flex flex-col items-center">
        {
          actions.map(action => {
            return (
              <li key={action.id} className={classnames('w-full h-1-dot-9 px-dot-8 flex items-center', useCss({
                '&:hover': {
                  'background-color': '#F0F6FF'
                }
              }))}>
                <img className="w-1-dot-2 h-1-dot-2 p-x-0-dot-4" src={action.icon} alt="logo" />
                <span className="text-dot-7">{action.text}</span>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

const dropdownContent = (
  <Menu width={152}>
    <MenuItem>绑定资源…</MenuItem>
    <MenuItem>调整带宽上线</MenuItem>
    <MenuItem>修改计费模式</MenuItem>
    <MenuItem>告警策略</MenuItem>
    <SubMenu title="添加到资源组">
      <MenuItem>绑定</MenuItem>
      <MenuItem>防火墙</MenuItem>
      <MenuItem>安置策略组</MenuItem>
      <MenuItem>内网域名别名</MenuItem>
      <MenuItem>SSH 密钥</MenuItem>
      <MenuItem>网络策略</MenuItem>
    </SubMenu>
    <MenuItem>重命名</MenuItem>
  </Menu>
);

const Title = ({title, id}: TreeNodeItem) => {

  const [ isShow, setIsShow ] = useState(false); 

  // 操作按钮
  const clickHandle = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    console.log("123");
    // setIsShow(true);
  }

  return (
    <div className="w-full flex items-center justify-between">
      <div className="text-dot-7">{title}</div>
      <div className="h-auto relative">
      {/* <span onClick={clickHandle}>...</span> */}
      {/* {
        isShow && <ActionsList />
      } */}
        <Dropdown className={useCss({
            '&': {
              'background-color': 'red !important',
              'top': '-2px',
              'left': '15px',
            }
          })
        } content={<ActionsList />}>
          <span onClick={clickHandle}>...</span>
        </Dropdown>
        {/* {id === '1' && <ActionsList />} */}
      </div>
    </div>
  )
}

export const DepartmentTree = () => {
  const treeData = [
    {
      title: '全象云应用开发平台',
      id: '1',
      key: '0',
      children: [
        {
          title: '分配部门1',
          key: '1-1',
          children: [],
        },
        {
          title: '分配部门2',
          key: '2-1',
          children: [
            {
              title: '第三层部门',
              key: '2-1-1',
            },
          ],
        },
      ],
    },
  ]


  const renderTreeNodes = (data: any) => data.map((item: any) => {
    const { children } = item;
    if (children) {
      return (
        <TreeNode title={<Title {...item} />} key={item.key} dataRef={item}>
          {renderTreeNodes(children)}
        </TreeNode>
      );
    }
    return <TreeNode title={<Title {...item} />} key={item.key} dataRef={item} />;
  });

  return (
    <div className="w-auto">
      <Tree
        defaultExpandAll
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
        {renderTreeNodes(treeData)}
      </Tree>
    </div>
  )
}

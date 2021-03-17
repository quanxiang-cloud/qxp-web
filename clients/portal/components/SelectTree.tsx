import React from 'react';
import useCss from 'react-use/lib/useCss';
import { Select, Tree, TreeNode } from '@QCFE/lego-ui';

interface SelectTreeProps {
  treeData: [];
}

export const SelectTree = (props: SelectTreeProps) => {
  const { treeData } = props;
  const [options, setOptions] = React.useState<any>([{}]);
  const [value, setValue] = React.useState('');

  const renderTreeNodes = (childData: any[]) =>
    childData.length > 0 &&
    childData.map((treenode: any) => {
      const { child } = treenode;
      if (child) {
        return (
          <TreeNode
            title={<div className="w-full">{treenode.departmentName}</div>}
            key={treenode.id}
            dataRef={treenode}
          >
            {renderTreeNodes(child)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={<div className="w-full">{treenode.departmentName}</div>}
          key={treenode.id}
          dataRef={treenode}
        />
      );
    });

  const menuRender = (option) => (
    <span className="option-with-icon" style={{ display: 'flex', alignItems: 'center' }}>
      <Tree defaultExpandAll onSelect={onSelect}>
        {treeData.length > 0 ? renderTreeNodes(treeData) : null}
      </Tree>
    </span>
  );

  const onSelect = (keys: string[], event: any) => {
    const treeItem: { departmentName: string; id: string } = event.selectedNodes[0].props.dataRef;
    console.log(treeItem);
    setOptions([{ value: treeItem.id, label: treeItem.departmentName }]);
    setValue(treeItem.id);
  };

  const changeValue = () => {
    console.log(value);
  };

  return (
    <>
      <Select
        name="os"
        className={useCss({
          '&:hover': {
            border: 'none',
            background: 'none',
          },
          '.select-control': {
            background: 'none',
            // border: 'to-blue-200',
          },
          '&': {
            // border: 'to-blue-300',
            background: 'none !important',
          },
          '.select-value-label': {
            'font-size': '14px',
          },
        })}
        menuRenderer={menuRender}
        placeholder="请选择所属部门"
        value={value}
        onChange={changeValue}
        options={options}
      />
    </>
  );
};

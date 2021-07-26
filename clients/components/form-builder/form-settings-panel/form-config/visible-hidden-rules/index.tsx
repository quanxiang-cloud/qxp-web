import React, { useContext } from 'react';

import Icon from '@c/icon';
import RuleList from './rule-list';
import RulesConfig from './rules-config';
import { StoreContext } from '@c/form-builder/context';

export default function(): JSX.Element {
  const store = useContext(StoreContext);
  const [isLinkageConfigVisible, setLinkageConfigVisible] = React.useState(false);
  const [editingLinkage, setEditingLinkage] = React.useState('');

  return (
    <>
      <div className="pb-24">
        <div className="item-title">字段显隐规则</div>
        <div className='page-setting-filter' onClick={() => {
          setEditingLinkage('');
          setLinkageConfigVisible(true);
        }}>
          <Icon className='mr-8' name='add' size={20} />
            显隐规则
        </div>
        <RuleList
          onEdit={(key) => {
            setEditingLinkage(key);
            setLinkageConfigVisible(true);
          }}
        />
      </div>
      {isLinkageConfigVisible && (
        <RulesConfig
          linkageKey={editingLinkage}
          mode={editingLinkage === '' ? '新增' : '编辑'}
          onSubmit={(linkage) => {
            store.handleLinkageChange(linkage);
            setLinkageConfigVisible(false);
            setEditingLinkage('');
          }}
          onClose={() => {
            setLinkageConfigVisible(false);
            setEditingLinkage('');
          }}
        />
      )}
    </>
  );
}

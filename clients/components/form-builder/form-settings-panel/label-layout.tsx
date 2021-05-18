import React, { useContext } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import Icon from '@c/icon';

import { StoreContext } from '../context';
import VisibleHiddenLinkageConfig from './visible-hidden-linkage-config';
import { INTERNAL_FIELD_NAMES } from '../store';
import ColumnNumberOption from './columns-count';

type RenderLayoutOptionProps = {
  labelAlign: 'right' | 'top';
  onChange: (labelAlign: 'right' | 'top') => void;
}
function RenderLayoutOption({ labelAlign, onChange }: RenderLayoutOptionProps) {
  return (
    <>
      <div
        className={cs('content-item', { 'item-checked': labelAlign === 'right' })}
        onClick={() => onChange('right')}
      >
        <div className="item-container">
          <span className="item-label"></span>
          <span className="item-body"></span>
        </div>
        <div className="item-container mt-8">
          <span className="item-label"></span>
          <span className="item-body"></span>
        </div>
        <div className="text-center">左右</div>
        <Icon name='done' type="light" className="check-icon" />
      </div>
      <div
        className={cs('content-item', { 'item-checked': labelAlign === 'top' })}
        onClick={() => onChange('top')}
      >
        <div className="grid grid-cols-1">
          <span className="item-label"></span>
          <span className="item-body mt-8" style={{ width: '96px' }}></span>
        </div>
        <div className="text-center">上下</div>
        <Icon name='done' type="light" className="check-icon" />
      </div>
    </>
  );
}

type KeyLabels = Record<string, { title: string, enum: Array<{ label: any, value: any }> }>;
type VisibleHiddenLinkagesProps = {
  onEdit: (key: string) => void;
}
function VisibleHiddenLinkageList({ onEdit }: VisibleHiddenLinkagesProps): JSX.Element {
  const store = useContext(StoreContext);
  const keyLabels: KeyLabels = Object.entries(store.schema.properties || {})
    .filter(([key]) => !INTERNAL_FIELD_NAMES.includes(key))
    .map(([key, value]) => {
      return {
        key,
        title: (value.title || key) as string,
        enum: (value.enum || []) as Array<{ label: string, value: string }>,
      };
    }).reduce((acc, current) => {
      acc[current.key] = current;
      return acc;
    }, {} as KeyLabels);

  if (!store.visibleHiddenLinkages.length) {
    return (
      <div className="text-caption">没有设置联动规则</div>
    );
  }

  return (
    <div>
      {
        store.visibleHiddenLinkages.map(({ key, rules, targetKeys }, index) => {
          const readableRules = rules.map(({ sourceKey, compareValue, compareOperator }) => {
            if (!keyLabels[sourceKey]) {
              return;
            }

            const { title, enum: options } = keyLabels[sourceKey];
            let compareValueText = compareValue;
            if (options.length) {
              options.find(({ label, value }) => {
                if (value === compareValue) {
                  compareValueText = label;
                }
                return value === compareValue;
              });
            }

            return `${title} ${compareOperator} ${compareValueText}`;
          }).filter((rule) => rule);

          const readableTargets = targetKeys.map((key) => {
            return keyLabels[key] ? keyLabels[key].title : key;
          }).join(', ');

          return (
            <div key={key} className="rounded-2 border-gray-200 border-t pt-8 mt-16">
              <div className="flex justify-between items-center">
                序号：#{index + 1}
                <span>
                  <Icon
                    clickable
                    changeable
                    name="edit"
                    className="mr-8"
                    onClick={() => onEdit(key)}
                    size={24}
                  />
                  <Icon
                    clickable
                    changeable
                    name="delete"
                    onClick={() => store.deleteLinkage(key)}
                    size={24}
                  />
                </span>
              </div>
              <div>当满足以下所有条件时: </div>
              {readableRules.map((rule) => (
                <div key={rule} className="text-h6-bold pl-12 mb-8">- {rule}</div>
              ))}
              <div>显示以下字段: </div>
              <div className="text-h6-bold pl-12 mb-8">{readableTargets}</div>
            </div>
          );
        })
      }
    </div>
  );
}

function FormLabelConfig(): JSX.Element {
  const store = useContext(StoreContext);
  const [isLinkageConfigVisible, setLinkageConfigVisible] = React.useState(false);
  const [editingLinkage, setEditingLinkage] = React.useState('');

  function handleClick(value: 'right' | 'top'): void {
    store.labelAlign = value;
  }

  return (
    <>
      <ColumnNumberOption />
      <div className="pt-6">
        <div className="pb-24">
          <div className="item-title">字段标题位置</div>
          <div className="layout-content">
            <RenderLayoutOption labelAlign={store.labelAlign} onChange={handleClick} />
          </div>
        </div>
        <div className="pb-24">
          <div className="item-title">字段显隐规则</div>
          <VisibleHiddenLinkageList
            onEdit={(key) => {
              setEditingLinkage(key);
              setLinkageConfigVisible(true);
            }}
          />
          <div className='page-setting-filter' onClick={() => setLinkageConfigVisible(true)}>
            <Icon className='mr-8' name='add' size={20} />
            显隐规则
          </div>
        </div>
        {/* <div className="pb-24">
          <div className="item-title">
            表单提交校验规则:
            <Icon className='ml-2' name="info" size={18} />
          </div>
          <div className='page-setting-filter'>
            <Icon className='mr-8' name='add' size={20} />
            添加表单校验规则
          </div>
        </div> */}
      </div>
      {isLinkageConfigVisible && (
        <VisibleHiddenLinkageConfig
          linkageKey={editingLinkage}
          sourceSchema={toJS(store.schema)}
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

export default observer(FormLabelConfig);

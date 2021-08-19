import React, { useContext } from 'react';

import Icon from '@c/icon';
import FormDataValueRenderer from '@c/form-data-value-renderer';
import { observer } from 'mobx-react';
import { StoreContext } from '@c/form-builder/context';
import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';
import schemaToFields, { schemaToMap } from '@lib/schema-convert';

type KeyLabels = Record<string, { title: string, enum: Array<{ label: any, value: any }> }>;
type VisibleHiddenLinkagesProps = {
  onEdit: (key: string) => void;
}
const RuleList = ({ onEdit }: VisibleHiddenLinkagesProps): JSX.Element => {
  const store = useContext(StoreContext);
  const keyLabels: KeyLabels = schemaToFields(store.schema)
    .filter((field) => !INTERNAL_FIELD_NAMES.includes(field.id))
    .map((field) => {
      return {
        key: field.id,
        title: (field.title || field.id) as string,
        enum: (field.enum || []) as Array<LabelValue>,
      };
    }).reduce((acc: KeyLabels, current) => {
      acc[current.key] = current;
      return acc;
    }, {});

  if (!store.visibleHiddenLinkages.length) {
    return (
      <div className="text-caption">没有设置联动规则</div>
    );
  }

  return (
    <div>
      {
        store.visibleHiddenLinkages.map(({ key, rules, targetKeys }, index) => {
          const readableTargets = targetKeys.map((key) => {
            return keyLabels[key] ? keyLabels[key].title : key;
          }).join(', ');

          return (
            <div key={key} className="rounded-8 border-gray-200 border mt-16">
              <div className="flex justify-between items-center p-10 border-b border-gray-200">
                <div className="mr-8 text-h6-bold">
                  <Icon name="grading" size={20} className="mr-8"/>{index + 1}
                </div>
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
              <div className="mt-8 pl-12">
                当满足以下
                <span className="text-h6-bold">
                  &nbsp;{store.visibleHiddenLinkages[index].ruleJoinOperator === 'every' ? '所有' : '任一'}&nbsp;
                </span>
                条件时:
              </div>
              {rules.map(({ sourceKey, compareValue, compareOperator }, index) => (
                <div key={index} className="text-h6-bold pl-24 mb-8">
                  - {`${keyLabels[sourceKey].title} ${compareOperator} `}
                  <FormDataValueRenderer
                    value={compareValue}
                    schema={schemaToMap(store.schema)?.[sourceKey]}
                  />
                </div>
              ))}
              <div className="pl-12">
                <span className="text-h6-bold">
                  &nbsp;{store.visibleHiddenLinkages[index].isShow === true ? '显示' : '隐藏'}&nbsp;
                </span>
                以下字段:
              </div>
              <div className="text-h6-bold pl-24 mb-8">{readableTargets}</div>
            </div>
          );
        })
      }
    </div>
  );
};

export default observer(RuleList);

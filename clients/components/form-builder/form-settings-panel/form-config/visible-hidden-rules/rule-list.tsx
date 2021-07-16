import React, { useContext } from 'react';

import Icon from '@c/icon';
import FormDataValueRenderer from '@c/form-data-value-renderer';
import { observer } from 'mobx-react';
import { Schema } from '@formily/react-schema-renderer';
import { StoreContext } from '@c/form-builder/context';
import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';

type KeyLabels = Record<string, { title: string, enum: Array<{ label: any, value: any }> }>;
type VisibleHiddenLinkagesProps = {
  onEdit: (key: string) => void;
}
const RuleList = ({ onEdit }: VisibleHiddenLinkagesProps): JSX.Element => {
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
              <div>
                当满足以下{store.visibleHiddenLinkages[index].ruleJoinOperator === 'every' ? '所有' : '任一'}条件时:
              </div>
              {rules.map(({ sourceKey, compareValue, compareOperator }, index) => (
                <div key={index} className="text-h6-bold pl-12 mb-8">
                  - {`${keyLabels[sourceKey].title} ${compareOperator} `}
                  <FormDataValueRenderer
                    value={compareValue}
                    schema={store.schema?.properties?.[sourceKey] as Schema}
                  />
                </div>
              ))}
              <div>{store.visibleHiddenLinkages[index].isShow === true ? '显示' : '隐藏'}以下字段: </div>
              <div className="text-h6-bold pl-12 mb-8">{readableTargets}</div>
            </div>
          );
        })
      }
    </div>
  );
};

export default observer(RuleList);

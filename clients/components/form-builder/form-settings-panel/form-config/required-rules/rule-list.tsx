import React, { useContext } from 'react';

import Icon from '@c/icon';
import FormDataValueRenderer from '@c/form-data-value-renderer';
import { observer } from 'mobx-react';
import { StoreContext } from '@c/form-builder/context';
import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';
import schemaToFields, { schemaToMap } from '@lib/schema-convert';

type KeyLabels = Record<string, { title: string, enum: Array<{ label: any, value: any }> }>;
type RequiredLinkagesProps = {
  onEdit: (key: string) => void;
}
const RuleList = ({ onEdit }: RequiredLinkagesProps): JSX.Element => {
  const store = useContext(StoreContext);
  const keyLabels: KeyLabels = schemaToFields(store.schema)
    .filter((field) => !INTERNAL_FIELD_NAMES?.includes(field.id))
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

  if (!store.requiredLinkages.length) {
    return (
      <div className="text-caption">没有设置必填规则</div>
    );
  }

  return (
    <div>
      {
        store.requiredLinkages.map(({ key, rules, targetKeys }, index) => {
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
                    onClick={() => store.deleteRequiredLinkage(key)}
                    size={24}
                  />
                </span>
              </div>
              <div className="mt-8 pl-12">
                当满足以下
                <span className="text-h6-bold">
                  &nbsp;{store.requiredLinkages[index].ruleJoinOperator === 'every' ? '所有' : '任一'}&nbsp;
                </span>
                条件时:
              </div>
              {rules.map(({ sourceKey, compareValue, compareOperator }, index) => (
                <div key={index} className="text-h6-bold pl-24 mb-8">
                  - {`${keyLabels[sourceKey]?.title || sourceKey} ${compareOperator} `}
                  {keyLabels[sourceKey] ? (<FormDataValueRenderer
                    value={compareValue}
                    schema={schemaToMap(store.schema)?.[sourceKey]}
                  />) : compareValue}
                </div>
              ))}
              <div className="pl-12">
                以下字段
                <span className="text-h6-bold">
                  &nbsp;{store.requiredLinkages[index].isRequired === true ? '必填' : '非必填'}&nbsp;
                </span>:
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

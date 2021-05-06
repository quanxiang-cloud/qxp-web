import React, { useState } from 'react';
import cs from 'classnames';

import Toggle from '@c/toggle';
import Icon from '@c/icon';

import {
  TriggerCondition as TriggerConditionType,
  Operator,
  TriggerConditionExpressionItem,
  TriggerConditionExpression,
} from '../../../store';
import ConditionItem, { ConditionItemOptions } from './condition-item';

interface Props {
  value: TriggerConditionType;
  formFieldOptions: ConditionItemOptions;
  onChange: (triggerCondition: TriggerConditionType) => void;
}

export default function TriggerCondition({ value, formFieldOptions, onChange }: Props) {
  const [openMore, setOpenMore] = useState(false);

  function updateTriggerConditionField(
    conditions: TriggerConditionType,
    currentCondition: TriggerConditionExpressionItem,
    newData: Partial<TriggerConditionExpressionItem> | null,
  ): TriggerConditionType {
    const { expr } = conditions;

    if (!expr) {
      return {
        ...conditions,
        ...newData,
      } as TriggerConditionType;
    }

    return {
      ...conditions,
      expr: expr.map((exprItem) => {
        if (exprItem === currentCondition) {
          if (newData === null) {
            return false;
          }
          return {
            ...exprItem,
            ...newData,
          };
        } else if (
          (exprItem as TriggerConditionType).expr && (exprItem as TriggerConditionType).expr.length
        ) {
          return updateTriggerConditionField(
            exprItem as TriggerConditionType,
            currentCondition,
            newData
          );
        } else {
          return exprItem;
        }
      }).filter(Boolean) as TriggerConditionExpression,
    };
  }

  function onValueChange(v?: boolean) {
    setOpenMore(!!v);
    if (v && !value) {
      addOrCondition();
    }
  }

  function onDelete(curCondition: TriggerConditionType) {
    onChange(updateTriggerConditionField(value, curCondition, null));
  }

  function onTriggerConditionItemChange(
    curCondition: TriggerConditionExpressionItem,
    val: Partial<TriggerConditionExpressionItem>
  ) {
    onChange(updateTriggerConditionField(value, curCondition, val));
  }

  function andConditionRender(
    triggerCondition: TriggerConditionType,
  ) {
    return (
      <div>
        {triggerCondition.expr.map((condition, index) => {
          if ((condition as TriggerConditionType).expr) {
            return andConditionRender(condition as TriggerConditionType);
          }

          return (
            <div key={index}>
              <header className="flex justify-between mb-8">
                <span>{index === 0 ? '当' : '且'}</span>
                {index === 0 && (
                  <span
                    onClick={() => onDelete(triggerCondition)}
                  >
                    <Icon name="delete" className="cursor-pointer" />
                  </span>
                )}
              </header>
              <ConditionItem
                condition={condition as { value: string; key: string; op: Operator }}
                options={formFieldOptions}
                onChange={(v) => onTriggerConditionItemChange(condition, v)}
              />
            </div>
          );
        })}
      </div>
    );
  }

  function addOrCondition() {
    if (!value) {
      onChange({
        op: 'or',
        expr: [{
          op: 'and',
          expr: [{
            key: '',
            op: '',
            value: '',
          }],
        }],
      });
    } else {
      onChange({
        ...value,
        expr: [
          ...value.expr,
          {
            op: 'and',
            expr: [{
              key: '',
              op: '',
              value: '',
            }],
          }],
      });
    }
  }

  function addAndCondition(condition: TriggerConditionType) {
    return () => {
      onChange(updateTriggerConditionField(value, condition, {
        ...condition,
        expr: [...condition.expr, {
          key: '',
          op: '',
          value: '',
        }],
      }));
    };
  }

  function conditionRender(conditions: TriggerConditionType = { op: 'or', expr: [] }) {
    if (!conditions.expr) {
      return null;
    }
    return conditions.expr.map((triggerCondition, index) => {
      return (
        <div key={index}>
          <section className="input-border-radius bg-gray-100 px-16 py-12">
            {triggerCondition.op === 'and' && andConditionRender(triggerCondition)}
            {triggerCondition.op === 'and' &&
              triggerCondition.expr.length < formFieldOptions.length && (
              <footer
                className="self-start inline-flex items-center cursor-pointer"
                onClick={addAndCondition(triggerCondition)}
              >
                <Icon name="add" className="text-blue-600 mr-3" />
                <span className="text-blue-600">
                添加且条件
                </span>
              </footer>
            )}
          </section>
          {conditions.op === 'or' && (index < conditions.expr.length - 1) && (
            <p className="px-16 my-16">或</p>
          )}
        </div>
      );
    });
  }

  return (
    <>
      <div className="flex items-center justify-between mb-16">
        <div>
          <div className="text-body2">触发条件</div>
          <span className="text-caption">设置触发筛选条件，满足条件后触发工作流</span>
        </div>
        <Toggle onChange={onValueChange} />
      </div>
      <div className={cs('overflow-hidden transition', {
        visible: openMore,
        invisible: !openMore,
        'h-0': !openMore,
        'h-auto': openMore,
        'opacity-0': !openMore,
        'opacity-1': openMore,
      })}>
        {conditionRender(value)}
        <div
          className={cs(
            'flex items-center border border-dashed border-gray-300 small-border-radius',
            'py-5 text-button my-16 justify-center cursor-pointer h-32',
          )}
          onClick={addOrCondition}
        >
          <Icon name="add" className="mr-8" size={20} />
          <span>添加或条件</span>
        </div>
      </div>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import cs from 'classnames';

import Toggle from '@c/toggle';
import Icon from '@c/icon';
import useObservable from '@lib/hooks/use-observable';

import store from '@flow/detail/content/editor/store';
import type {
  TriggerCondition as TriggerConditionType,
  TriggerConditionExpressionItem,
  TriggerConditionExpression,
  StoreValue,
  TriggerConditionValue,
  FormDataData,
} from '@flow/detail/content/editor/type';

import ConditionItem, { ConditionItemOptions } from './condition-item';

interface Props {
  value: TriggerConditionType;
  formFieldOptions: ConditionItemOptions;
  onChange: (v: Partial<FormDataData>) => void;
}

export default function TriggerCondition({
  value,
  formFieldOptions,
  onChange: _onChange,
}: Props): JSX.Element | null {
  const [openMore, setOpenMore] = useState(!!value?.expr?.length);
  const { validating } = useObservable<StoreValue>(store);

  useEffect(() => {
    setOpenMore(!!value?.expr?.length);
  }, [value]);

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
            newData,
          );
        } else {
          return exprItem;
        }
      }).filter(Boolean) as TriggerConditionExpression,
    };
  }

  function onValueChange(v?: boolean): void {
    setOpenMore(!!v);
    if (!v) {
      return onChange({ op: '', expr: [] });
    }
    if (v && !value?.expr?.length) {
      addOrCondition(true);
    }
  }

  function onChange(triggerCondition: TriggerConditionType): void {
    _onChange({ triggerCondition });
  }

  function onDelete(curCondition: TriggerConditionType): void {
    onChange(updateTriggerConditionField(value, curCondition, null));
  }

  function onTriggerConditionItemChange(
    curCondition: TriggerConditionExpressionItem,
    val: Partial<TriggerConditionExpressionItem>,
  ): void {
    onChange(updateTriggerConditionField(value, curCondition, val));
  }

  function andConditionRender(
    triggerCondition: TriggerConditionType,
  ): JSX.Element {
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
                condition={condition as TriggerConditionValue}
                options={formFieldOptions}
                onChange={(v) => onTriggerConditionItemChange(condition, v)}
              />
            </div>
          );
        })}
      </div>
    );
  }

  function addOrCondition(isInit?: boolean): void {
    if (!value) {
      onChange({
        op: isInit ? '' : 'or',
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
        op: value.expr.length ? 'or' : '',
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

  function conditionRender(conditions: TriggerConditionType): JSX.Element[] | null {
    if (!conditions?.expr) {
      return null;
    }
    return conditions.expr.map((triggerCondition, index) => {
      const isValid = triggerCondition.op === 'and' && validating ?
        triggerCondition.expr.every((exp) => {
          const expItem = exp as TriggerConditionValue;
          return !!(expItem.key && expItem.op && expItem.value);
        }) : true;

      return (
        <div key={index}>
          <div className={cs('border', {
            'border-red-600': !isValid,
          })}>
            <section className="corner-2-8-8-8 bg-gray-100 px-16 py-12">
              {triggerCondition.op === 'and' && andConditionRender(triggerCondition)}
              {triggerCondition.op === 'and' &&
              (triggerCondition.expr.length < formFieldOptions.length) && (
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
            {(conditions.op === 'or' || conditions.op === '') &&
            (index < conditions.expr.length - 1 ) && (
              <p className="px-16 my-16">或</p>
            )}
          </div>
          {!isValid && (
            <div className="text-caption-no-color text-red-600 mt-4 mb-8">请先完善筛选条件</div>
          )}
        </div>
      );
    });
  }

  if (!formFieldOptions?.length) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-16">
        <div>
          <div className="text-body2">触发条件</div>
          <span className="text-caption">设置触发筛选条件，满足条件后触发工作流</span>
        </div>
        <Toggle onChange={onValueChange} defaultChecked={openMore} />
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
            'flex items-center border border-dashed border-gray-300 corner-8-2-8-8',
            'py-5 text-button my-16 justify-center cursor-pointer h-32',
          )}
          onClick={() => addOrCondition()}
        >
          <Icon name="add" className="mr-8" size={20} />
          <span>添加或条件</span>
        </div>
      </div>
    </>
  );
}

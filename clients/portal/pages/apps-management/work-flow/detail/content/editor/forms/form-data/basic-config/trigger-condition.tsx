import React, { useState } from 'react';
import classnames from 'classnames';

import Toggle from '@c/toggle';
import Icon from '@c/icon';

import { AndCondition, Conditions, updateDataField, CurrentElement } from '../../../store';
import ConditionItem, { ConditionItemOptions } from './condition-item';

interface Props {
  currentElement: CurrentElement;
  formFieldOptions: ConditionItemOptions;
}

export default function({ currentElement, formFieldOptions }: Props) {
  const [openMore, setOpenMore] = useState(false);
  const { triggerCondition = [] } = currentElement.data || {};

  function onChange(v?: boolean) {
    setOpenMore(!!v);
    if (v && !triggerCondition.length) {
      addOrCondition();
    }
  }

  function onDelete(andCondition: AndCondition) {
    return () => {
      updateDataField('formData', 'triggerCondition', (conditions: Conditions): Conditions => {
        return conditions.filter((condition) => condition !== andCondition);
      });
    };
  }

  function andConditionRender(
    andCondition: AndCondition,
  ) {
    return (
      <div>
        {andCondition.map((condition, index) => {
          const values = andCondition.filter((cond) => cond !== condition).map(({
            fieldValue,
          }) => fieldValue);
          return (
            <div key={condition.fieldName || index}>
              <header className="flex justify-between mb-8">
                <span>{index === 0 ? '当' : '且'}</span>
                {index === 0 && (
                  <span
                    onClick={
                      onDelete(andCondition)}
                  >
                    <Icon name="delete" className="cursor-pointer" />
                  </span>
                )}
              </header>
              <ConditionItem
                condition={condition}
                options={formFieldOptions.filter(({ value }) => {
                  return !values.includes(value);
                })}
              />
            </div>
          );
        })}
      </div>
    );
  }

  function addOrCondition() {
    updateDataField('formData', 'triggerCondition', (conditions: Conditions): Conditions => {
      return [
        ...conditions, [{ fieldName: '', fieldValue: '', operator: '', operatorValue: '' }],
      ];
    });
  }

  function addAndCondition(condition: AndCondition) {
    return () => {
      updateDataField('formData', 'triggerCondition', (conditions: Conditions): Conditions => {
        return conditions.map((andCondition: AndCondition) => {
          if (condition === andCondition) {
            return [
              ...andCondition,
              { fieldName: '', fieldValue: '', operator: '', operatorValue: '' },
            ];
          }
          return andCondition;
        });
      });
    };
  }

  function conditionRender(conditions: Conditions = []) {
    return conditions.map((andCondition, index) => {
      const useableOptions = formFieldOptions.filter((option) => {
        return !andCondition.find((condition) => condition.fieldValue === option.value);
      });
      return (
        <div key={index}>
          <section className="select-border-radius bg-white px-16 py-12">
            {andConditionRender(andCondition)}
            {!!useableOptions.length && andCondition.length < formFieldOptions.length && (
              <footer
                className="self-start inline-flex items-center cursor-pointer"
                onClick={addAndCondition(andCondition)}
              >
                <Icon name="add" className="text-blue-600 bg-white" />
                <span className="text-blue-600">
                添加且条件
                </span>
              </footer>
            )}
          </section>
          {(index < conditions.length - 1) && (
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
        <Toggle onChange={onChange} />
      </div>
      <div className={classnames('overflow-hidden transition-all', {
        visible: openMore,
        invisible: !openMore,
        'h-0': !openMore,
        'h-auto': openMore,
        'opacity-0': !openMore,
        'opacity-1': openMore,
      })}>
        {conditionRender(triggerCondition)}
        <div
          className={classnames(
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

import React, { CSSProperties, WheelEvent } from 'react';
import cs from 'classnames';

import useObservable from '@lib/hooks/use-observable';
import store from '@flow/detail/content/editor/store';
import type { StoreValue } from '@flow/detail/content/editor/type';

interface Props {
  onDayChange: (value: string) => void;
  onHoursChange: (value: string) => void;
  onMinutesChange: (value: string) => void;
  defaultDay: number;
  defaultHours: number;
  defaultMinutes: number;
  style?: CSSProperties;
  validating?: boolean;
}

export default function TimerSelector({
  onDayChange,
  onHoursChange,
  onMinutesChange,
  defaultDay,
  defaultHours,
  defaultMinutes,
  style = {},
  validating: _validating,
}: Props): JSX.Element {
  const { validating: __validating } = useObservable<StoreValue>(store);
  const validating = _validating != null ? _validating : __validating;

  function onWheel(e: WheelEvent<HTMLInputElement>): void {
    (e.target as HTMLInputElement).blur();
  }

  const isTimeInValid = validating && (
    +defaultDay <= 0 && +defaultHours <= 0 && +defaultMinutes <= 0);

  function inputBuilder(
    value: number,
    onChange: (value: string) => void,
    text: string,
    config?: { min: number, max?: number },
  ): JSX.Element {
    return (
      <>
        <input
          {...config}
          type="number"
          className={cs('input w-full flex-1', {
            'border-red-600': isTimeInValid,
          })}
          style={{ paddingRight: 36 }}
          onChange={(e) => {
            let val = +e.target.value;
            if (val < (config?.min ?? 0)) {
              val = config?.min ?? 0;
            } else if (val > (config?.max ?? Infinity)) {
              val = config?.max ?? Infinity;
            }
            onChange(`${val}`);
          }}
          value={value}
          onWheel={onWheel}
        />
        <span className="absolute right-5 top-1/2 transform -translate-y-1/2
        text-body2-no-color text-gray-400">
          {text}
        </span>
      </>
    );
  }

  return (
    <div
      className="flex flex-col py-16"
      style={{ borderBottom: '1px solid var(--gray-200)', ...style }}
    >
      <div className="flex items-center">
        <div className="relative mr-12 flex-1">
          {inputBuilder(defaultDay, onDayChange, '天', { min: 0 })}
        </div>
        <div className="relative mr-12 flex-1">
          {inputBuilder(defaultHours, onHoursChange, '小时', { min: 0, max: 23 })}
        </div>
        <div className="relative flex-1">
          {inputBuilder(defaultMinutes, onMinutesChange, '分钟', { min: 0, max: 59 })}
        </div>
      </div>
      {isTimeInValid && (
        <div className="text-red-600 text-caption-no-color mt-4">请输入大于0的时间</div>
      )}
    </div>
  );
}

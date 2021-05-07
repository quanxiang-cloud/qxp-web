import React, { ChangeEventHandler, CSSProperties, WheelEvent } from 'react';

interface Props {
  onDayChange: ChangeEventHandler<HTMLInputElement>;
  onHoursChange: ChangeEventHandler<HTMLInputElement>;
  onMinutesChange: ChangeEventHandler<HTMLInputElement>;
  defaultDay: string;
  defaultHours: string;
  defaultMinutes: string;
  style?: CSSProperties,
}

export default function TimerSelector({
  onDayChange,
  onHoursChange,
  onMinutesChange,
  defaultDay,
  defaultHours,
  defaultMinutes,
  style = {},
}: Props) {
  function onWheel(e: WheelEvent<HTMLInputElement>) {
    (e.target as HTMLInputElement).blur();
  }

  return (
    <div
      className="flex items-center py-16"
      style={{ borderBottom: '1px solid var(--gray-200)', ...style }}
    >
      <div className="relative mr-12">
        <input
          type="number"
          className="input w-full flex-1"
          style={{ paddingRight: 36 }}
          onChange={onDayChange}
          value={defaultDay}
          onWheel={onWheel}
        />
        <span className="absolute right-5 top-1/2 transform -translate-y-1/2
        text-body2-no-color text-gray-400">
          天
        </span>
      </div>
      <div className="relative mr-12">
        <input
          type="number"
          className="input w-full flex-1"
          style={{ paddingRight: 36 }}
          max="24"
          maxLength={2}
          onChange={onHoursChange}
          value={defaultHours}
          onWheel={onWheel}
        />
        <span className="absolute right-5 top-1/2 transform -translate-y-1/2
        text-body2-no-color text-gray-400">
          小时
        </span>
      </div>
      <div className="relative">
        <input
          type="number"
          className="input w-full flex-1"
          style={{ paddingRight: 36 }}
          max="60"
          maxLength={2}
          onChange={onMinutesChange}
          value={defaultMinutes}
          onWheel={onWheel}
        />
        <span className="absolute right-5 top-1/2 transform -translate-y-1/2
          text-body2-no-color text-gray-400">
            分钟
        </span>
      </div>
    </div>
  );
}

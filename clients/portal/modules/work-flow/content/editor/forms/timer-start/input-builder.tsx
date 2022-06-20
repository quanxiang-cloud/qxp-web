import React, { FC, ReactElement, WheelEvent } from 'react';
import cs from 'classnames';

interface Props{
  value: number,
  onChange: (value: string) => void,
  text: string,
  config?: { min: number, max?: number },
  validate?: boolean;
}
const inputBuilder: FC<Props> = ({ value, onChange, text, config, validate = false }): ReactElement=> {
  const onWheel = (e: WheelEvent<HTMLInputElement>): void=> {
    (e.target as HTMLInputElement).blur();
  };
  return (
    <>
      <input
        {...config}
        type="number"
        className={cs('input w-full flex-1', {
          'border-red-600': validate,
        })}
        style={{ paddingRight: 36 }}
        onWheel={onWheel}
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
      />
      <span className="absolute right-5 top-1/2 transform -translate-y-1/2
      text-body2-no-color text-gray-400">
        {text}
      </span>
    </>
  );
};
export default inputBuilder;

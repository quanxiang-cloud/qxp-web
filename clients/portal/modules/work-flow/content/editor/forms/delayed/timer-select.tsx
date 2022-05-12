import React, { CSSProperties, FC, useMemo } from 'react';
import { Controller, Control, useWatch } from 'react-hook-form';
import { omit } from 'ramda';

import InputBuilder from './input-builder';
import { DelayedTypes } from './types';
interface Props<T =DelayedTypes> {
  style?: CSSProperties;
  control: Control<T>;
}

const TimerSelector: FC<Props> = ({ style = {}, control }): JSX.Element=> {
  const [day, hour, minutes] = useWatch({
    control,
    name: ['day', 'hour', 'minutes'],
  });
  const isError = useMemo(()=>{
    return !(+day <= 0 && +hour <= 0 && +minutes <= 0);
  }, [day, hour, minutes]);

  return (
    <div
      className="flex flex-col py-16"
      style={style}
    >
      <div className="flex items-center">
        <div className="relative mr-12 flex-1">
          <Controller
            rules={{ required: true, validate: ()=>isError }}
            name='day'
            control={control}
            render={({ field })=>(
              <InputBuilder
                validate={!isError}
                text='天'
                config={{ min: 0 }}
                {...omit(['ref'], field)}/>)}
          />
        </div>
        <div className="relative mr-12 flex-1">
          <Controller
            name='hour'
            control={control}
            rules={{ required: true, validate: ()=>isError }}
            render={({ field })=>
              (<InputBuilder
                validate={!isError}
                {...omit(['ref'], field)}
                text='小时'
                config={{ min: 0, max: 23 }}
              />)}
          />
        </div>
        <div className="relative flex-1">
          <Controller
            name='minutes'
            control={control}
            rules={{ required: true, validate: ()=>isError }}
            render={({ field })=>
              (<InputBuilder
                validate={!isError}
                {...omit(['ref'], field)}
                text='分钟'
                config={{ min: 0, max: 59 }}
              />)}
          />
        </div>
      </div>
      {!isError && (
        <div className="text-red-600 text-caption-no-color mt-4">请输入大于0的时间</div>
      )}

    </div>
  );
};
export default TimerSelector;

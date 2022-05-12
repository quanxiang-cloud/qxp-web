import { DelayedTypes, ExecutionType } from './types';
import type {
  DelayedValue,
  DelayedType,
} from '@flow/content/editor/type';

const defaultVal: DelayedTypes = {
  hour: 0,
  minutes: 0,
  day: 0,
  date: undefined,
  dataID: '',
  columnID: '',
  execution: 'today',
  fieldDay: 0,
  fieldTime: undefined,
};
export function getDefaultVal(val: DelayedValue): DelayedTypes {
  const { delayPolicy } = val;
  if (!delayPolicy) {
    return defaultVal;
  }
  const { type, data: { timeFmt, column: { columnID, dataID } } } = delayPolicy;
  const obj = transValToTypes(timeFmt, type);
  return { ...obj, columnID, dataID };
}

export function getDelayedValue(val: DelayedTypes, type: DelayedType, tableID: string): DelayedValue {
  const { columnID, dataID, date = '', execution } = val;
  const timeFmt = getTimeSecond( val, type);
  return {
    delayPolicy: {
      type,
      data: {
        timeFmt: type === 'specTime' ? date : setFimeFmt(execution, timeFmt),
        column: { columnID, dataID, tableID },
      },
    },
  };
}

function transValToTypes(timeFmt: string|number, type: DelayedType): DelayedTypes {
  const { day, hour, minutes } = getTime(timeFmt);
  switch (type) {
  case 'tableColumn':
    if (day > 0) {
      Object.assign(defaultVal, { execution: 'after' });
    }
    if (day < 0) {
      Object.assign(defaultVal, { execution: 'before' });
    }
    if (day === 0) {
      Object.assign(defaultVal, { execution: 'today' });
    }
    Object.assign(defaultVal, { fieldTime: `${hour}:${minutes}`, fieldDay: day });
    break;
  case 'aTime':
    Object.assign(defaultVal, { hour, minutes, day });
    break;
  case 'specTime':
    Object.assign(defaultVal, { date: timeFmt });
  }
  return defaultVal;
}

function getTime(value: number|string): Pick<DelayedTypes, 'day'|'hour'|'minutes'> {
  if (isString(value)) {
    return {
      day: 0,
      hour: 0,
      minutes: 0,
    };
  }
  const val = Math.abs(value);
  const day = Math.floor(val / (24 * 3600));
  const time = val % (24 * 3600);
  const hour = Math.floor(time / 3600);
  const minutes = time % 60;
  return {
    day,
    hour,
    minutes,
  };
}

function getTimeSecond( val: DelayedTypes, type: DelayedType): number {
  const { day, hour, minutes, fieldDay, fieldTime = '0:0' } = val;
  let timeFmt = 0;
  const [h, m] = fieldTime.split(':');
  switch (type) {
  case 'tableColumn':
    timeFmt = getSecond(fieldDay, parseInt(h), parseInt(m));
    break;
  case 'aTime':
    timeFmt = getSecond(day, hour, minutes);

    break;
  }
  return timeFmt;
}

function isString(val: string|number): val is string {
  return typeof val === 'string';
}

function getSecond(d: number, h: number, m: number): number {
  return (d * 24 * 3600) + (h * 3600) + (m * 60);
}
function setFimeFmt(type: ExecutionType, timeFmt: number): number {
  switch (type) {
  case 'before':
    return -timeFmt;
  default:
    return timeFmt;
  }
}

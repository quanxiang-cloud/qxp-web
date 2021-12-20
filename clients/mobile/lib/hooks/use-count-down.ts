import { useEffect, useMemo, useState, useRef } from 'react';
import { cancelRaf, raf } from '@m/qxp-ui-mobile/utils/raf';
import { inBrowser } from '@m/qxp-ui-mobile/utils';

export type CurrentTime = {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};

export type UseCountDownOptions = {
  time: number;
  millisecond?: boolean;
  autostart?: boolean;
  onChange?: (current: CurrentTime) => void;
  onFinish?: () => void;
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function parseTime(time: number): CurrentTime {
  const days = Math.floor(time / DAY);
  const hours = Math.floor((time % DAY) / HOUR);
  const minutes = Math.floor((time % HOUR) / MINUTE);
  const seconds = Math.floor((time % MINUTE) / SECOND);
  const milliseconds = Math.floor(time % SECOND);

  return {
    total: time,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
}

function isSameSecond(time1: number, time2: number): boolean {
  return Math.floor(time1 / 1000) === Math.floor(time2 / 1000);
}

export interface CountDownResult {
  start: () => void;
  pause: () => void;
  reset: () => void;
  current: CurrentTime;
}

export default function useCountDown(options: UseCountDownOptions): CountDownResult {
  const rafId = useRef(0);
  const endTime = useRef(0);
  const counting = useRef(false);

  const [remain, updateRemain] = useState(() => options.time);
  const remainRef = useRef(0);
  const current = useMemo(() => parseTime(remain), [remain]);

  remainRef.current = remain;

  const pause = (): void => {
    counting.current = false;
    cancelRaf(rafId.current);
  };

  const getCurrentRemain = (): number => Math.max(endTime.current - Date.now(), 0);

  const setRemain = (value: number): void => {
    remainRef.current = value;
    updateRemain(value);
    options.onChange?.(current);

    if (value === 0) {
      pause();
      options.onFinish?.();
    }
  };

  const microTick = (): void => {
    rafId.current = raf(() => {
      // in case of call reset immediately after finish
      if (counting.current) {
        setRemain(getCurrentRemain());

        if (remainRef.current > 0) {
          microTick();
        }
      }
    });
  };

  const macroTick = (): void => {
    rafId.current = raf(() => {
      // in case of call reset immediately after finish
      if (counting.current) {
        const remainRemain = getCurrentRemain();
        if (!isSameSecond(remainRemain, remainRef.current) || remainRemain === 0) {
          setRemain(remainRemain);
        }
        if (remainRef.current > 0) {
          macroTick();
        }
      }
    });
  };

  const tick = (): void => {
    if (!inBrowser) {
      return;
    }

    if (options.millisecond) {
      microTick();
    } else {
      macroTick();
    }
  };

  const start = (): void => {
    if (!counting.current) {
      endTime.current = Date.now() + remainRef.current;
      counting.current = true;
      tick();
    }
  };

  const reset = (totalTime: number = options.time): void => {
    pause();
    remainRef.current = totalTime;
    updateRemain(totalTime);
  };

  useEffect(() => {
    if (options.autostart) {
      start();
    }
  }, []);

  return {
    start,
    pause,
    reset,
    current,
  } as const;
}

import dayjs from 'dayjs';

export function formatTime(date: Date, absolute = false): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  if (!absolute) {
    const now = new Date();
    const nowYear = now.getFullYear();

    if (nowYear - year > 0) {
      return `${nowYear - year}年前`;
    } else if (nowYear - year < 0) {
      return `${year - nowYear}年后`;
    } else if (now.getMonth() - month - 1 === 0 && now.getDate() - day) { // Today
      return [hour, minute].map(formatNumber).join(':');
    }
    return `${month}月${day}日`;
  }

  const second = date.getSeconds();
  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  );
}

export function formatRelativeTime(time: Date): string {
  const timeStamp = new Date(time).getTime();
  const currTimeStamp = new Date().getTime();

  const timeDiffer = Math.abs(currTimeStamp - timeStamp);

  const _second = Math.floor(timeDiffer / 1000);
  if (_second < 60) {
    return '刚刚';
  }

  const _minute = Math.floor(timeDiffer / (1000 * 60));
  if (0 < _minute && _minute < 60) {
    return `${_minute}分钟前`;
  }

  const currZeroPointStamp = new Date().getTime();
  const oldZeroPointStamp = currZeroPointStamp - 86400000;

  if (timeStamp >= currZeroPointStamp && timeStamp <= currTimeStamp) {
    const _hour = Math.floor(timeDiffer / (1000 * 60 * 60));
    return `${_hour}小时前`;
  }

  if (timeStamp >= oldZeroPointStamp && timeStamp < currZeroPointStamp) {
    return '昨天 ' + dayjs(time).format('HH:mm');
  }

  const currYear = new Date().getFullYear();
  const currYearZeroPointStamp = new Date(`${currYear}/01/01 00:00:00`).getTime();
  if (currYearZeroPointStamp <= timeStamp) {
    return dayjs(time).format('M月D日');
  }

  const timeYear = time.getFullYear();
  if (timeYear < currYear) {
    return `${currYear - timeYear}年前`;
  } else {
    return `${timeYear - currYear}年后`;
  }
}

function formatNumber(n: number): string {
  const s = n.toString();
  return s[1] ? s : '0' + s;
}

export function formatTimeSeconds(time: number, absolute = false): string {
  return formatTime(new Date(time * 1000), absolute);
}

export function greeting(username?: string): string {
  const hour = new Date().getHours();
  let greeting;
  if (hour >= 6 && hour < 8) {
    greeting = '早上好！';
  } else if (hour >= 8 && hour < 11) {
    greeting = '上午好！';
  } else if (hour >= 11 && hour < 13) {
    greeting = '中午好！';
  } else if (hour >= 13 && hour < 18) {
    greeting = '下午好！';
  } else {
    greeting = '晚上好！';
  }
  return username ? `${username}，${greeting}` : greeting;
}

interface TimeRangeFormatter {
  millSecondsLimit: number,
  suffix: string,
}

const TIME_RANGE_FORMATTERS: TimeRangeFormatter[] = [
  { millSecondsLimit: 365 * 24 * 60 * 60 * 1000, suffix: '年' },
  { millSecondsLimit: 30 * 24 * 60 * 60 * 1000, suffix: '个月' },
  { millSecondsLimit: 24 * 60 * 60 * 1000, suffix: '天' },
  { millSecondsLimit: 60 * 60 * 1000, suffix: '小时' },
  { millSecondsLimit: 60 * 1000, suffix: '分钟' },
  { millSecondsLimit: 1000, suffix: '秒' },
];

/**
 * Format the [dueDate] to an overtime tag string(AKA relative time string) in flow tasks.
 *
 * Will format with [TIME_RANGE_FORMATTERS] from years to seconds.
 * To keep the flow overtime tag sort and clean,
 * The function will slice the result array with length 2.
 *
 * @param {string} dueDate UTC time string, just pass the apis' origin [dueDate] value.
 *
 * @return {string} If current flow task does not over time, an empty string('') returned.
 *          Else, the formatted string returned.
 */
export function formatOverTime(dueDate?: string): string {
  if (!dueDate) return '';
  let millSeconds = dayjs().valueOf() - dayjs(dueDate).valueOf();
  // Only the time greater than 1 second will show the over time tag.
  if (millSeconds < 1000) return '';
  // We place all the formatted string into an array.
  const result: string[] = [];
  TIME_RANGE_FORMATTERS.forEach((formatter) => {
    if (millSeconds < formatter.millSecondsLimit) return;
    // * years / * months / * days / * hours / * minutes / * seconds
    const count = Math.floor(millSeconds / formatter.millSecondsLimit);
    result.push(`${count}${formatter.suffix}`);
    millSeconds -= count * formatter.millSecondsLimit;
  });

  return '超时：' + result.slice(0, 2).join('');
}

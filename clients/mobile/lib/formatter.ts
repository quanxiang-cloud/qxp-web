import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export function formatTime(date: Date, absolute = false): string {
  if (!absolute) {
    return formatRelativeTime(date);
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  );
}

export function formatRelativeTime(time: dayjs.ConfigType): string {
  const now = dayjs();
  const diffDate = dayjs(time);

  let unit = '前';
  if (now.isBefore(diffDate)) {
    unit = '后';
  }

  const duration = dayjs.duration(now.diff(diffDate));

  const years = duration.years();
  if (years > 0) return `${years}年${unit}`;

  const months = duration.months();
  if (months > 0) {
    // Check if the years equal
    if (now.year() === diffDate.year()) return diffDate.format('M月D日');
    else return diffDate.format('YYYY年M月D日');
  }

  const days = duration.days();
  if (days === 1) {
    if (unit === '前') return `昨天 ${diffDate.format('HH:mm')}`;
    else return `明天 ${diffDate.format('HH:mm')}`;
  }
  if (days > 0) return `${days}天${unit}`;

  const hours = duration.hours();
  if (hours > 0) return `${hours}小时${unit}`;

  const minutes = duration.minutes();
  if (minutes > 0) return `${minutes}分钟${unit}`;

  return '刚刚';
}

function formatNumber(n: number): string {
  const s = n.toString();
  return s[1] ? s : '0' + s;
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

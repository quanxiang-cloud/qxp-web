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

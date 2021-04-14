import moment from 'moment';
import { presetOptions } from './constants';

export const getPresetDate = (preset: string): {start: moment.Moment; end: moment.Moment} => {
  let start;
  let end = moment();

  switch (preset) {
  case 'recent_seven_days':
    start = moment().add(-7, 'days').startOf('day');
    break;
  case 'recent_one_month':
    start = moment().add(-1, 'months').startOf('day');
    break;
  case 'recent_three_months':
    start = moment().add(-3, 'months').startOf('day');
    break;
  case 'last_week':
    start = moment().add(-1, 'weeks').startOf('isoWeek');
    end = start.clone().endOf('isoWeek');
    break;
  default:
    start = moment().add(-1, 'months').startOf('month');
    end = start.clone().endOf('month');
  }

  return { start, end };
};

export const getInputValue = (readableCode: string | undefined): string => {
  if (!readableCode) {
    return '';
  }

  const [rangeType = 'customized', range = ''] = readableCode?.split(':');

  if (!range) {
    return '';
  }

  switch (rangeType) {
  case 'day':
    return moment(range, 'YYYY-MM-DD').format('YYYY [年] M [月] D [日]');
  case 'week':
    const date = moment(range, 'YYYY-WW');
    const start = date.clone().startOf('isoWeek');
    const end = date.clone().endOf('isoWeek');
    return `${date.format('YYYY [年第] W [周]')} (${start.format('MMDD')} - ${end.format('MMDD')})`;
  case 'month':
    return moment(range, 'YYYY-MM').format('YYYY [年] M [月]');
  case 'customized':
    const preset = presetOptions.find((option) => option.value === range);

    if (preset) {
      const label = preset.label;
      const { start, end } = getPresetDate(preset.value);
      return `${label} (${start.format('MMDD')} - ${end.format('MMDD')})`;
    }

    if (range) {
      return range.split('/').join(' 至 ');
    }

    return '';
  default:
    return '';
  }
};

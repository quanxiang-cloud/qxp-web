import moment from 'moment';

export const scrollToOption = (ele: React.RefObject<HTMLUListElement>): void => {
  const wrap: HTMLUListElement | null = ele.current;
  if (!wrap) return;
  const activeItem: HTMLElement | null = wrap.querySelector('.is-active');
  if (!activeItem) return;

  const { scrollTop } = wrap;
  const scrollBottom = scrollTop + wrap.offsetHeight;
  const optionTop = activeItem.offsetTop;
  const optionBottom = optionTop + activeItem.offsetHeight;

  if (scrollTop > optionTop || scrollBottom < optionBottom) {
    wrap.scrollTop = activeItem.offsetTop - 6;
  }
};

export const isDateOutRange = (
  date: moment.Moment,
  minDate: moment.Moment | null,
  maxDate: moment.Moment | null,
  unit: 'year' | 'month' | 'isoWeek' | 'day',
): boolean => {
  if (minDate && date.isBefore(minDate, unit)) {
    return true;
  }

  if (maxDate && date.isAfter(maxDate, unit)) {
    return true;
  }

  return false;
};

import * as React from 'react';
import moment from 'moment';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { computed } from 'mobx';

import { isDateOutRange } from './utils';

type Props = {
  week: moment.Moment;
  selectedDate?: moment.Moment;
  displayDate: moment.Moment;
  minDate: moment.Moment | null;
  maxDate: moment.Moment | null;
  picker?: string;
  onDayClick: (d: moment.Moment) => void;
}

@observer
export default class Week extends React.Component<Props> {
  static defaultProps = {
    picker: 'day',
  };

  @computed get isSelectedWeek(): boolean {
    const { selectedDate, week, picker } = this.props;
    return selectedDate && picker === 'week' ? week.isSame(selectedDate, 'isoWeek') : false;
  }

  @computed get isWeekOutRange(): boolean {
    const { minDate, maxDate, week } = this.props;
    return isDateOutRange(week, minDate, maxDate, 'isoWeek');
  }

  isSelectedDate = (day: moment.Moment): boolean => {
    const { selectedDate } = this.props;
    return selectedDate ? day.isSame(selectedDate, 'day') : false;
  }

  isOutsideMonth = (day: moment.Moment): boolean => {
    return !day.isSame(this.props.displayDate, 'month');
  }

  isDateOutRange = (date: moment.Moment): boolean => {
    const { minDate, maxDate } = this.props;
    return isDateOutRange(date, minDate, maxDate, 'day');
  }

  handleWeekClick = (date: moment.Moment): void => {
    if (this.props.picker === 'week' && !this.isWeekOutRange) {
      this.props.onDayClick(date);
    }
  }

  handleDayClick = (date: moment.Moment): void => {
    if (this.props.picker === 'week') {
      return;
    }

    this.props.onDayClick(date);
  }

  render(): JSX.Element {
    const startOfWeek = this.props.week.clone().startOf('isoWeek');
    const weekIndex = startOfWeek.isoWeek();

    return (
      <div
        className={cs('calendar-month__week', {
          'calendar-month__week-picker': this.props.picker === 'week',
          'calendar-month__selected-week': this.isSelectedWeek,
          'calendar-month__outside-range-week': this.isWeekOutRange,
        })}
        onClick={(): void => this.handleWeekClick(startOfWeek)}
      >
        {
          this.props.picker === 'week' ? (
            <span className="calendar-month__week-index">{weekIndex}</span>
          ) : null
        }
        {
          [0, 1, 2, 3, 4, 5, 6].map((offset) => {
            const day = startOfWeek.clone().add(offset, 'days');
            const isOutsideMonth = this.isOutsideMonth(day);
            const isDateOutRange = this.isDateOutRange(day);
            const isSelectedDate = this.isSelectedDate(day);
            return (
              <span
                key={offset}
                onClick={(): void => {
                  !isDateOutRange && this.handleDayClick(day);
                }}
                className={cs('calendar-month__single-day', {
                  'calendar-month__outside-month-day': isOutsideMonth,
                  'calendar-month__outside-range-day': isDateOutRange,
                  'calendar-month__selected-day': isSelectedDate || this.isSelectedWeek,
                })}
              >
                {day.date()}
              </span>
            );
          })
        }
      </div>
    );
  }
}

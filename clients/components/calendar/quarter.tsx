import * as React from 'react';
import moment from 'moment';
import cs from 'classnames';

import { isDateOutRange } from './utils';

type Props = {
  quarter: moment.Moment;
  selectedDate?: moment.Moment;
  minDate: moment.Moment | null;
  maxDate: moment.Moment | null;
  onMonthClick: (d: moment.Moment) => void;
}

export default class Quarter extends React.Component<Props> {
  isSelectedMonth = (month: moment.Moment): boolean => {
    const { selectedDate } = this.props;
    return selectedDate ? month.isSame(selectedDate, 'month') : false;
  }

  isOutsideRange = (month: moment.Moment): boolean => {
    const { minDate, maxDate } = this.props;
    return isDateOutRange(month, minDate, maxDate, 'month');
  }

  handleMonthClick = (month: moment.Moment): void => {
    this.props.onMonthClick(month);
  }

  render(): JSX.Element {
    const startOfMonth = this.props.quarter.clone().startOf('month');

    return (
      <div className="calendar-year__quarter">
        {
          [0, 1, 2].map((offset) => {
            const month = startOfMonth.clone().add(offset, 'months');
            const isOutsideRange = this.isOutsideRange(month);
            const isSelectedMonth = this.isSelectedMonth(month);
            return (
              <div
                key={offset}
                onClick={(): void => {
                  !isOutsideRange && this.handleMonthClick(month);
                }}
                className={cs('calendar-year__single-month', {
                  'calendar-year__outside-range-month': isOutsideRange,
                  'calendar-year__selected-month': isSelectedMonth,
                })}
              >
                <div>{month.month() + 1}月</div>
              </div>
            );
          })
        }
      </div>
    );
  }
}

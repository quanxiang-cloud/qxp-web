import * as React from 'react';
import moment from 'moment';

import Week from './week';
import zh from './constants';

type Props = {
  selectedDate?: moment.Moment;
  displayDate: moment.Moment;
  minDate: moment.Moment | null;
  maxDate: moment.Moment | null;
  picker?: string;
  onDayClick: (d: moment.Moment) => void;
}

export default class Month extends React.Component<Props> {
  handleDayClick = (day: moment.Moment): void => {
    this.props.onDayClick(day);
  }

  renderHeader(): JSX.Element {
    return (
      <div className="calendar-month__header">
        {
          this.props.picker === 'week' ? <span>周</span> : null
        }
        {
          zh.listOfWeek.map((week: string) => {
            return (
              <span key={week}>{week}</span>
            );
          })
        }
      </div>
    );
  }

  renderWeeks(): JSX.Element {
    const weekStart = this.props.displayDate
      .clone()
      .startOf('month')
      .startOf('isoWeek');

    return (
      <div className="calendar-month__weeks">
        {
          [0, 1, 2, 3, 4, 5].map((offset: number) => {
            return (
              <Week
                key={offset}
                week={weekStart.clone().add(offset, 'weeks')}
                selectedDate={this.props.selectedDate}
                displayDate={this.props.displayDate}
                minDate={this.props.minDate}
                maxDate={this.props.maxDate}
                picker={this.props.picker}
                onDayClick={this.handleDayClick}
              />
            );
          })
        }
      </div>
    );
  }

  render(): JSX.Element {
    return (
      <div className="calendar-month">
        {this.renderHeader()}
        {this.renderWeeks()}
      </div>
    );
  }
}

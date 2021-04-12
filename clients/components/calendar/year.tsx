import * as React from 'react';
import moment from 'moment';

import Quarter from './quarter';


type Props = {
  selectedDate?: moment.Moment;
  displayDate: moment.Moment;
  minDate: moment.Moment | null;
  maxDate: moment.Moment | null;
  onMonthClick: (d: moment.Moment) => void;
}

export default class Year extends React.Component<Props> {

  handleMonthClick = (day: moment.Moment): void => {
    this.props.onMonthClick(day);
  }

  renderQuarters = (): JSX.Element => {
    const yearStart = this.props.displayDate
      .clone()
      .startOf('year');

    return (
      <div className="calendar-year__quarters">
        {
          [0, 1, 2, 3].map((offset: number) => {
            return (
              <Quarter
                key={offset}
                quarter={yearStart.clone().add(offset, 'quarters')}
                selectedDate={this.props.selectedDate}
                minDate={this.props.minDate}
                maxDate={this.props.maxDate}
                onMonthClick={this.handleMonthClick}
              />
            );
          })
        }
      </div>
    );
  }

  render(): JSX.Element {
    return (
      <div className="calendar-year">
        {this.renderQuarters()}
      </div>
    );
  }

}

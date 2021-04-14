import * as React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';

import Header from './header';
import Month from './month';
import Year from './year';

type Props = {
  selectedDate?: moment.Moment;
  minDate?: string;
  maxDate?: string;
  picker?: 'day' | 'week' | 'month';
  onChange: (d: moment.Moment) => void;
}

@observer
export default class Calendar extends React.Component<Props> {
  static defaultProps = {
    picker: 'day',
  };

  @observable displayDate: moment.Moment;

  constructor(props: Props) {
    super(props);

    const { selectedDate } = this.props;
    this.displayDate = selectedDate && moment(selectedDate).isValid() ?
      moment(selectedDate) : moment();
  }

  @computed get minDate(): moment.Moment | null {
    const { minDate } = this.props;
    return minDate && moment(minDate).isValid() ? moment(minDate) : null;
  }

  @computed get maxDate(): moment.Moment | null {
    const { maxDate } = this.props;
    return maxDate && moment(maxDate).isValid() ? moment(maxDate) : null;
  }

  @action
  handleChangeDisplay = (date: moment.Moment): void => {
    this.displayDate = date.clone();
  }

  @action
  handleChangeSelected = (date: moment.Moment): void => {
    this.displayDate = date.clone();
    this.props.onChange(date.clone());
  }

  render(): JSX.Element {
    const { selectedDate } = this.props;

    return (
      <div className="calendar">
        <Header
          date={this.displayDate}
          minDate={this.minDate}
          maxDate={this.maxDate}
          picker={this.props.picker}
          onChangeDate={this.handleChangeDisplay}
        />
        {
          this.props.picker === 'month' ? (
            <Year
              selectedDate={selectedDate}
              displayDate={this.displayDate.clone()}
              minDate={this.minDate}
              maxDate={this.maxDate}
              onMonthClick={this.handleChangeSelected}
            />
          ) : (
            <Month
              selectedDate={selectedDate}
              displayDate={this.displayDate.clone()}
              minDate={this.minDate}
              maxDate={this.maxDate}
              picker={this.props.picker}
              onDayClick={this.handleChangeSelected}
            />
          )
        }
      </div>
    );
  }
}

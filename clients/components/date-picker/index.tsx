import * as React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';

import Popper from '@c/popper';
import Icon from '@c/icon';
import Calendar from '@c/calendar';

type Props = {
  selectedDate?: string;
  minDate?: string;
  maxDate?: string;
  dateFormat?: string;
  picker?: 'day' | 'week' | 'month';
  inputValue?: string;
  className?: string;
  style? :React.CSSProperties;
  onChange: (d: string) => void;
}

@observer
export default class DatePicker extends React.Component<Props> {
  @observable selectedDate: moment.Moment | null;

  popperRef = React.createRef<Popper>();
  reference = React.createRef<HTMLDivElement>();

  static defaultProps = {
    dateFormat: 'YYYY-MM-DD',
    picker: 'day',
  };

  constructor(props: Props) {
    super(props);

    const { selectedDate } = this.props;
    this.selectedDate = selectedDate && moment(selectedDate).isValid() ?
      moment(selectedDate) : null;
  }

  componentDidUpdate(prevProps: Props): void {
    const { selectedDate } = this.props;
    if (prevProps.selectedDate !== selectedDate) {
      this.selectedDate = selectedDate && moment(selectedDate).isValid() ?
        moment(selectedDate) : null;
    }
  }

  @computed get inputValue(): string {
    const { dateFormat } = this.props;
    return this.selectedDate ? this.selectedDate.format(dateFormat) : '';
  }

  @action
  handleCalendarClick = (date: moment.Moment): void => {
    this.selectedDate = date;
    this.props.onChange(this.inputValue);
    this.popperRef.current && this.popperRef.current.close();
  }

  @action
  handleClearDay = (): void => {
    this.selectedDate = null;
    this.props.onChange('');
    this.popperRef.current && this.popperRef.current.close();
  }

  renderCalendar(): JSX.Element {
    const { minDate, maxDate, picker } = this.props;
    return (
      <div className="date-picker">
        <Calendar
          selectedDate={this.selectedDate || undefined}
          minDate={minDate}
          maxDate={maxDate}
          picker={picker}
          onChange={this.handleCalendarClick}
        />
      </div>
    );
  }

  render(): JSX.Element {
    const { inputValue, className, style } = this.props;

    return (
      <>
        <div
          ref={this.reference}
          style={style}
          className={classnames('date-picker__input', className, {
            'date-picker--has-selected-day': !!this.selectedDate,
          })}
        >
          <input
            value={inputValue || this.inputValue}
            className="input"
            type="text"
            readOnly
          />
          <Icon
            className="date-picker__right-icon date-picker__calendar-icon"
            name="calendar"
            size={16}
          />
          <Icon
            changeable
            clickable
            className="date-picker__right-icon date-picker__close-icon"
            name="close"
            size={16}
            onClick={this.handleClearDay}
          />
        </div>
        <Popper
          ref={this.popperRef}
          reference={this.reference}
          placement="bottom-start"
        >
          {this.renderCalendar()}
        </Popper>
      </>
    );
  }
}

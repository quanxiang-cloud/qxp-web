import React from 'react';
import moment from 'moment';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

import Popper from '@c/popper';
import Icon from '@c/icon';
import Switch from '@c/switch';
import Calendar from '@c/calendar';
import Custom from './custom';
import { getInputValue } from './utils';

type Props = {
  readableCode?: string;
  minDate?: string;
  maxDate?: string;
  dateFormat?: string;
  inputValue?: string;
  className?: string;
  style?: React.CSSProperties;
  onChange: (d: { start: string; end: string; readableCode: string }) => void;
}

type RangeType = 'customized' | 'day' | 'week' | 'month';

@observer
export default class RangePicker extends React.Component<Props> {
  @observable range = '';
  @observable rangeType: RangeType = 'customized';
  @observable _rangeType: RangeType = 'customized';

  popperRef = React.createRef<Popper>();
  reference = React.createRef<HTMLDivElement>();

  static defaultProps = {
    dateFormat: 'YYYY-MM-DD',
  };

  constructor(props: Props) {
    super(props);

    this.setRange();
  }

  componentDidUpdate(prevProps: Props): void {
    if (prevProps.readableCode !== this.props.readableCode) {
      this.setRange();
    }
  }

  @action
  setRange = (): void => {
    const { readableCode } = this.props;
    this.range = readableCode?.split(':')[1] || '';
    this.rangeType = readableCode?.split(':')[0] as RangeType || 'customized';
    this._rangeType = readableCode?.split(':')[0] as RangeType;
  }

  @action
  handleChangeRangeType = (rangeType: RangeType): void => {
    this.rangeType = rangeType;
  }

  @action
  handleCalendarClick = (date: moment.Moment): void => {
    let start; let end; let range;

    if (this.rangeType === 'month') {
      start = date.clone().startOf('month');
      end = date.clone().endOf('month');
      range = date.format('YYYY-MM');
    } else if (this.rangeType === 'week') {
      start = date.clone().startOf('isoWeek');
      end = date.clone().endOf('isoWeek');
      range = date.format('YYYY-WW');
    } else {
      start = date.clone().startOf('day');
      end = date.clone().endOf('day');
      range = date.format('YYYY-MM-DD');
    }

    this.handleChangeRange(start, end, range);
  }

  @action
  handleChangeRange = (startDate: moment.Moment, endDate: moment.Moment, range: string): void => {
    const { dateFormat, onChange } = this.props;
    const readableCode = `${this.rangeType}:${range}`;

    onChange({
      start: startDate.format(dateFormat),
      end: endDate.format(dateFormat),
      readableCode,
    });

    this.popperRef.current && this.popperRef.current.close();
  }

  @action
  handleClear = (): void => {
    this.popperRef.current && this.popperRef.current.close();
    this.props.onChange({
      start: '',
      end: '',
      readableCode: '',
    });
  }

  renderCalendar(): JSX.Element {
    return (
      <div className="date-picker">
        <Switch
          onChange={this.handleChangeRangeType}
          className="range-picker__range-type"
          options={[
            {
              label: '最近',
              value: 'customized',
            },
            {
              label: '天',
              value: 'day',
            },
            {
              label: '周',
              value: 'week',
            },
            {
              label: '月',
              value: 'month',
            },
          ]} />
        {this.renderBody()}
      </div>
    );
  }

  renderBody(): JSX.Element {
    const { minDate, maxDate } = this.props;

    if (this.rangeType === 'customized') {
      return (
        <Custom
          range={this.range}
          rangeType={this._rangeType}
          minDate={minDate}
          maxDate={maxDate}
          dateFormat={this.props.dateFormat || 'YYYY-MM-DD'}
          onChange={this.handleChangeRange}
        />
      );
    }

    let selectedDate;
    if (this._rangeType === this.rangeType) {
      selectedDate = this._rangeType === 'week' ?
        moment(this.range, 'YYYY-WW') : moment(this.range, 'YYYY-MM-DD');
    }

    return (
      <Calendar
        selectedDate={selectedDate}
        minDate={minDate}
        maxDate={maxDate}
        picker={this.rangeType as 'day' | 'week' | 'month'}
        onChange={this.handleCalendarClick}
      />
    );
  }

  render(): JSX.Element {
    const { inputValue, readableCode, className, style } = this.props;

    return (
      <>
        <div ref={this.reference} style={style} className={cs('date-picker__input', className, {
          'date-picker--has-selected-day': readableCode,
        })}>
          <input
            value={inputValue || getInputValue(readableCode)}
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
            onClick={this.handleClear}
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

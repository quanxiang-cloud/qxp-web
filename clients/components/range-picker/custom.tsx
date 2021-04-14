import * as React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';

import Calendar from '@c/calendar';
import { presetOptions } from './constants';
import { getPresetDate } from './utils';


type Props = {
  range: string;
  rangeType: string;
  minDate?: string;
  maxDate?: string;
  dateFormat?: string;
  onChange: (startDate: moment.Moment, endDate: moment.Moment, range: string) => void;
}

@observer
export default class Year extends React.Component<Props> {

  @observable startDate: moment.Moment | null;
  @observable endDate: moment.Moment | null;
  @observable openCalendar: '' | 'startDate' | 'endDate' = '';

  constructor(props: Props) {
    super(props);

    const { range } = this.props;

    if (this.isUserDefined) {
      const date = range.split('/');
      this.startDate = moment(date[0]);
      this.endDate = moment(date[1]);
    } else {
      this.startDate = null;
      this.endDate = null;
    }
  }

  @computed get isUserDefined(): boolean {
    const { range, rangeType } = this.props;
    const isPreset = presetOptions.some((option) => option.value === range);

    return Boolean(!isPreset && range && rangeType === 'customized');
  }

  handleOptionClick = (option: string): void => {
    const { start, end } = getPresetDate(option);

    this.props.onChange(start, end, option);
  }

  @action
  handleToggleCalendar = (type: 'startDate' | 'endDate'): void => {
    this.openCalendar = this.openCalendar === type ? '' : type;
  }

  @action
  handleCalendarClick = (date: moment.Moment): void => {
    if (this.openCalendar === 'startDate') {
      this.startDate = date.startOf('day');
    } else {
      this.endDate = date.endOf('day');
    }
    // this.openCalendar = '';
  }

  handleConfirmCustom = (): void => {
    if (this.startDate && this.endDate) {
      const range = `${this.startDate.format('YYYY-MM-DD')}/${this.endDate.format('YYYY-MM-DD')}`;
      this.props.onChange(this.startDate, this.endDate, range);
    }
  }

  renderPresetOptions = (): JSX.Element => {
    return (
      <div className="range-picker-custom__preset-options">
        {
          presetOptions.map((option) => (
            <div
              key={option.value}
              className={classnames('range-picker-custom__option', {
                'range-picker-custom__selected': this.props.range === option.value,
              })}
              onClick={(): void => this.handleOptionClick(option.value)}
            >{option.label}</div>
          ))
        }
      </div>
    );
  }

  renderUserDefined = (): JSX.Element => {
    const { dateFormat } = this.props;

    return (
      <>
        <div className="range-picker-custom__user-defined">
          <div className={classnames('range-picker-custom__user-defined-title', {
            'range-picker-custom__user-defined-selected': this.isUserDefined,
          })}>自定义</div>
          <div className="range-picker-custom__date-trigger-wrap">
            <div
              className={classnames('range-picker-custom__date-trigger', {
                'range-picker-custom__date-trigger--open': this.openCalendar === 'startDate',
              })}
              onClick={(): void => this.handleToggleCalendar('startDate')}
            >
              {this.startDate ? moment(this.startDate).format(dateFormat) : ''}
            </div>
            <div
              className={classnames('range-picker-custom__date-trigger', {
                'range-picker-custom__date-trigger--open': this.openCalendar === 'endDate',
              })}
              onClick={(): void => this.handleToggleCalendar('endDate')}
            >
              {this.endDate ? moment(this.endDate).format(dateFormat) : ''}
            </div>
          </div>
        </div>
      </>
    );
  }

  renderCalendar = (): JSX.Element | null => {
    if (this.openCalendar) {
      const { minDate, maxDate } = this.props;
      const selectedDate = this.openCalendar === 'startDate' ? this.startDate : this.endDate;
      const min = this.openCalendar === 'endDate' && this.startDate
        ? this.startDate.format() : minDate;
      const max = this.openCalendar === 'startDate' && this.endDate
        ? this.endDate.format() : maxDate;

      return (
        <>
          <Calendar
            selectedDate={selectedDate || undefined}
            minDate={min}
            maxDate={max}
            picker="day"
            onChange={this.handleCalendarClick}
          />
          {
            this.startDate && this.endDate && (
              <div className="range-picker-custom__confirm">
                <button className="button" onClick={this.handleConfirmCustom}>确定</button>
              </div>
            )
          }
        </>
      );
    }

    return null;
  }

  render(): JSX.Element {
    return (
      <div className="ranger-picker-custom">
        {this.renderPresetOptions()}
        {this.renderUserDefined()}
        {this.renderCalendar()}
      </div>
    );
  }

}

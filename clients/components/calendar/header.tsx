import React from 'react';
import moment from 'moment';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';

import Icon from '@c/icon';
import zh from './constants';
import { scrollToOption, isDateOutRange } from './utils';

type Props = {
  date: moment.Moment;
  picker?: 'day' | 'week' | 'month';
  minDate: moment.Moment | null;
  maxDate: moment.Moment | null;
  onChangeDate: (month: moment.Moment) => void;
}

@observer
export default class Header extends React.Component<Props> {
  yearMenuRef = React.createRef<HTMLUListElement>();
  monthMenuRef = React.createRef<HTMLUListElement>();
  listOfYear: number[] = [];

  @observable isOpen = false;

  static defaultProps = {
    picker: 'day',
  };

  constructor(props: Props) {
    super(props);

    for (let i = this.year - 10; i < this.year + 10; i = i + 1) {
      this.listOfYear.push(i);
    }
  }

  @computed get year(): number {
    return this.props.date.year();
  }

  @computed get month(): number {
    return this.props.date.month();
  }

  @action
  handleToggleDropdown = (): void => {
    if (this.isOpen) {
      this.isOpen = false;
      return;
    }

    this.isOpen = true;
    scrollToOption(this.yearMenuRef);
    scrollToOption(this.monthMenuRef);
  }

  @action
  handleMouseLeave = (): void => {
    this.isOpen = false;
  }

  @action
  handleYearClick = (year: number): void => {
    const newTime = this.props.date
      .clone()
      .year(year);
    this.props.onChangeDate(newTime);
  }

  @action
  handleMonthClick = (month: number): void => {
    const newTime = this.props.date
      .clone()
      .month(month);
    this.props.onChangeDate(newTime);
  }

  @action
  handleShift = (delta: -1 | 1): void => {
    const unit = this.props.picker === 'month' ? 'years' : 'months';
    const newTime = this.props.date
      .clone()
      .add(delta, unit);
    this.props.onChangeDate(newTime);
    this.isOpen = false;
  }

  isOutsideRange = (date: moment.Moment, unit: 'month' | 'year'): boolean => {
    const { minDate, maxDate } = this.props;
    return isDateOutRange(date, minDate, maxDate, unit);
  }

  renderYearMenu(): JSX.Element {
    return (
      <ul ref={this.yearMenuRef} className="calendar-header__menu">
        {
          this.listOfYear.map((year: number) => {
            const isOutsideRange = this.isOutsideRange(moment().year(year), 'year');
            const isActive = year === this.year;

            return (
              <li
                key={year}
                onClick={(): void => {
                  !isOutsideRange && this.handleYearClick(year);
                }}
                className={cs({
                  'is-outside-range': isOutsideRange,
                  'is-active': isActive,
                })}
              >{year}</li>
            );
          })
        }
      </ul>
    );
  }

  renderMonthMenu(): JSX.Element {
    const { date } = this.props;
    const optionList = zh.listOfMonth.map((monthStr: string, index: number) => {
      const option = date
        .clone()
        .month(index);
      const isOutsideRange = this.isOutsideRange(option, 'month');
      const isActive = index === this.month;

      return (
        <li
          key={monthStr}
          onClick={(): void => {
            !isOutsideRange && this.handleMonthClick(index);
          }}
          className={cs({
            'is-outside-range': isOutsideRange,
            'is-active': isActive,
          })}
        >{monthStr}</li>
      );
    });

    return (
      <ul ref={this.monthMenuRef} className="calendar-header__menu">
        {optionList}
      </ul>
    );
  }

  render(): JSX.Element {
    return (
      <div className="calendar-header">
        <span
          onClick={(): void => this.handleShift(-1)}
          className="calendar-header__shift"
        >
          <Icon name="arrow_back_ios" size={20} />
        </span>
        <div className="calendar-header__date">
          <span
            onClick={this.handleToggleDropdown}
            className={cs('calendar-header__label', {
              'is-open': this.isOpen,
            })}
          >
            {this.props.picker === 'month' ? `${this.year}年` : `${this.year}年 ${this.month + 1}月`}
          </span>
          <div
            onMouseLeave={this.handleMouseLeave}
            className={cs('calendar-header__dropdown', {
              'calendar-header__dropdown--wide': this.props.picker !== 'month',
              'is-active': this.isOpen,
            })}
          >
            {this.renderYearMenu()}
            {this.props.picker !== 'month' ? this.renderMonthMenu() : null}
          </div>
        </div>
        <span
          onClick={(): void => this.handleShift(1)}
          className="calendar-header__shift"
        >
          <Icon name="arrow_forward_ios" size={20} />
        </span>
      </div>
    );
  }
}

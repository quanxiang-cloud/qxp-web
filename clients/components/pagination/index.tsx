import React from 'react';
import cs from 'classnames';
import { Input } from '@QCFE/lego-ui';

import SvgIcon from '@c/icon';
import Select from '@c/select';

import Pager from './pager';

import './index.scss';

export interface Props {
  current?: number;
  total?: number;
  hideOnSinglePage?: boolean;
  pageSize?: number;
  onChange?: (current: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showQuickJumper?: boolean;
  renderTotalTip?: (total: number, range?: [number, number]) => React.ReactNode;
  showLessItems?: boolean;
  className?: string;
}

function Pagination({
  current = 1,
  total = 0,
  pageSize = 10,
  hideOnSinglePage,
  pageSizeOptions = [10, 20, 50, 100],
  renderTotalTip,
  showSizeChanger = true,
  showQuickJumper,
  showLessItems,
  onChange,
  className,
}: Props) {
  if (hideOnSinglePage && total <= pageSize) {
    return null;
  }

  const [pageParams, setPageParams] = React.useState({
    current: current || 0,
    _current: '',
    pageSize: pageSize || 10,
  });

  function calcPage(p?: number) {
    let pageSizes = p;
    if (typeof pageSizes === 'undefined') {
      pageSizes = pageParams.pageSize;
    }
    return Math.floor((total - 1) / pageSizes) + 1;
  }

  function isValid(page: number) {
    return typeof page === 'number' && page >= 1 && page !== pageParams.current;
  }

  function handleChange(p: number) {
    let page = p;
    if (isValid(page)) {
      if (page > calcPage()) {
        page = calcPage();
      }
    }

    setPageParams({
      current: page,
      pageSize: pageParams.pageSize,
      _current: '',
    });

    onChange && onChange(page, pageParams.pageSize);

    return pageParams.current;
  }

  function changePageSize(size: number) {
    setPageParams({
      current: 1,
      pageSize: size,
      _current: '',
    });
    onChange && onChange(1, size);
  }

  function handleInputOnblur() {
    const isNumber = pageParams._current !== '' && !isNaN(Number(pageParams._current));
    if (isNumber) {
      handleChange(Number(pageParams._current));
    }
  }

  function handleInputKeydown(e: React.KeyboardEvent) {
    if (e.key !== 'Enter') {
      return;
    }
    handleInputOnblur();
  }

  function handPrev() {
    if (hasPrev()) {
      handleChange(pageParams.current - 1);
    }
  }

  function handleNext() {
    if (hasNext()) {
      handleChange(pageParams.current + 1);
    }
  }

  function handleJumpPrev() {
    handleChange(Math.max(1, pageParams.current - 5));
  }

  function handleJumpNext() {
    handleChange(Math.min(calcPage(), pageParams.current + 5));
  }

  function hasPrev() {
    return pageParams.current > 1;
  }

  function hasNext() {
    return pageParams.current < calcPage();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPageParams({
      pageSize: pageParams.pageSize,
      current: pageParams.current,
      _current: e.target.value,
    });
  }

  const prevIcon = (
    <li
      className={cs('pagination-comp-page', {
        'pagination-comp-disabled': pageParams.current === 1,
      })}
      onClick={handPrev}>
      <SvgIcon name="chevron_left" />
    </li>
  );

  const nextIcon = (
    <li
      className={cs('pagination-comp-page', {
        'pagination-comp-disabled': pageParams.current === calcPage(),
      })}
      onClick={handleNext}>
      <SvgIcon name="chevron_right" />
    </li>
  );

  const allPages = calcPage();
  const pagerList = [];
  let firstPager = null;
  let lastPager = null;
  let jumpPrev = null;
  let jumpNext = null;
  let totalText = null;
  let pageSizeText = null;
  let quickJumperText = null;

  if (allPages <= 9) {
    for (let i = 1; i <= allPages; i += 1) {
      const active = pageParams.current === i;
      pagerList.push(<Pager
        key={i}
        page={i}
        active={active}
        onClick={() => handleChange(i)}
      />);
    }
  } else {
    lastPager = (<Pager key={allPages} page={allPages} active={false}
      onClick={() => handleChange(allPages)} />);
    firstPager = (<Pager key={1} page={1} active={false} onClick={() => handleChange(1)} />);
    jumpPrev = (
      <li
        key="jumpPrev"
        className="pagination-comp-page pagination-comp-jump pagination-comp-jump-prev"
        onClick={handleJumpPrev}>
        <SvgIcon className="icon" name="more_horiz" />
        <SvgIcon className="prev" name="double_arrow"
          color="#375FF3" style={{ transform: 'rotate(180deg)' }} />
      </li>);
    jumpNext = (
      <li
        key="jumpNext"
        className="pagination-comp-page pagination-comp-jump pagination-comp-jump-next"
        onClick={handleJumpNext}>
        <SvgIcon className="icon" name="more_horiz" />
        <SvgIcon className="next" name="double_arrow" color="#375FF3" />
      </li>);

    const num = showLessItems ? 2 : 4;
    const secondNum = showLessItems ? 3 : 4;

    const _current = pageParams.current;
    let left = Math.max(1, _current - (num / 2));
    let right = Math.min(_current + (num / 2), allPages);

    if (_current - 1 <= num / 2) {
      right = 1 + num;
    }

    if (allPages - _current <= num / 2) {
      left = allPages - num;
    }

    for (let i = left; i <= right; i += 1) {
      const active = _current === i;
      pagerList.push((<Pager key={i} page={i} active={active}
        onClick={() => handleChange(i)} />));
    }

    if (_current - 1 >= secondNum) {
      pagerList.unshift(jumpPrev);
    }
    if (allPages - _current >= secondNum) {
      pagerList.push(jumpNext);
    }

    if (left !== 1) {
      pagerList.unshift(firstPager);
    }
    if (right !== allPages) {
      pagerList.push(lastPager);
    }
  }

  if (renderTotalTip) {
    totalText = (<>{renderTotalTip(allPages)}</>);
  }

  if ((showSizeChanger && total <= 50) || total > 50) {
    pageSizeText = (
      <li className="ml-16">
        <div className="flex items-center">
          <div className="text-12 mr-6 text-center leading-28">每页</div>
          <Select
            style={{ height: '28px', padding: '0 12px' }}
            value={pageParams.pageSize}
            onChange={changePageSize}
            options={pageSizeOptions ? pageSizeOptions.map((page: number) => ({
              label: `${page} 条`,
              value: page,
            })) : []}
          />
        </div>
      </li>
    );
  }

  if (showQuickJumper) {
    quickJumperText = (
      <li className="ml-16">
        <div className="flex items-center">
          <div className="text-12 mr-6 text-center leading-28">跳至</div>
          <Input
            value={pageParams._current}
            onChange={handleInputChange}
            onBlur={handleInputOnblur}
            onKeyDown={handleInputKeydown}
            className="w-40 h-28 border border-gray-300 select-border-radius
            px-12 text-12 flex items-center"
          />
          <div className="text-12 ml-6 text-center leading-28">页</div>
        </div>
      </li>
    );
  }

  return (
    <div className="w-full px-20 flex items-center justify-between">
      <div>
        {totalText}
      </div>
      <ul className={cs('pagination-comp', className)}>
        {prevIcon}
        {pagerList}
        {nextIcon}
        {pageSizeText}
        {quickJumperText}
      </ul>
    </div>
  );
}

export default Pagination;

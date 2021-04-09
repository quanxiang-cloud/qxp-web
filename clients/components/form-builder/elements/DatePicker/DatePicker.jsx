import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { DatePicker as AntdDatePicker } from 'antd';

const { RangePicker } = AntdDatePicker;
const formatMap = {
  dft: 'YYYY-MM-DD',
  week: 'gggg-wo',
  month: 'YYYY-MM',
  year: 'YYYY',
  quarter: 'YYYY-MM',
};

const DatePicker = props => {
  const getAttrFromProps = () => {
    if (props.props) {
      const { name, value, mutators, props: componentProps } = props;
      const {
        picker,
        showTime,
        allowClear,
        rangePicker,
        placeholder,
        ...restProps
      } = componentProps['x-component-props'];
      return {
        name,
        value,
        mutators,
        picker,
        showTime,
        allowClear,
        rangePicker,
        placeholder,
        restProps,
      };
    }
    const {
      name,
      value,
      picker,
      placeholder,
      showTime,
      allowClear,
      rangePicker,
      ...restProps
    } = props;
    return { name, value, picker, placeholder, showTime, allowClear, rangePicker, restProps };
  };
  const {
    mutators,
    picker = 'dft',
    allowClear,
    placeholder,
    value,
    format,
    showTime,
    rangePicker,
    restProps,
  } = getAttrFromProps();

  const [defaultValue, setDefaultValue] = useState(null);
  const realFormat = format || formatMap[picker] || 'YYYY-MM-DD';

  const onChange = v => {
    const isArr = Array.isArray(v);
    const handleChange = mutators ? mutators.change : restProps.onChange;
    let formatDate;
    if (picker === 'quarter') {
      if (isArr) {
        const v1 = `${moment(v[0]).format('YYYY')}-Q${moment(v[0]).quarter()}`;
        const v2 = `${moment(v[1]).format('YYYY')}-Q${moment(v[1]).quarter()}`;
        formatDate = [v1, v2];
      } else {
        formatDate = `${moment(v).format('YYYY')}-Q${moment(v).quarter()}`;
      }
    } else if (picker === 'week') {
      if (isArr) {
        const v1 = `${moment(v[0]).format('YYYY')}-${moment(v[0]).week()}th`;
        const v2 = `${moment(v[1]).format('YYYY')}-${moment(v[1]).week()}th`;
        formatDate = [v1, v2];
      } else {
        formatDate = `${moment(v).format('YYYY')}-${moment(v).week()}th`;
      }
    } else if (isArr) {
      const v1 = moment(v[0]).format(realFormat);
      const v2 = moment(v[1]).format(realFormat);
      formatDate = [v1, v2];
    } else {
      formatDate = moment(v).format(realFormat);
    }

    return handleChange(formatDate);
  };

  useEffect(() => {
    let computedValue = value && value.indexOf(',') > -1 ? value.split(',') : value;
    if (!rangePicker && Array.isArray(computedValue)) [computedValue] = computedValue;
    const isArray = Array.isArray(computedValue);
    if (!computedValue) {
      setDefaultValue(null);
    } else if (picker === 'quarter') {
      if (isArray) {
        const parsed1 = computedValue[0].match(/\D*(\d+)\D*(\d+)\D*/) || ['', '', ''];
        const parsed2 = computedValue[1].match(/\D*(\d+)\D*(\d+)\D*/) || ['', '', ''];
        setDefaultValue([
          moment(parsed1[1], 'YYYY').add(parsed1[2] - 1, 'Q'),
          moment(parsed2[1], 'YYYY').add(parsed2[2] - 1, 'Q'),
        ]);
      } else {
        const parsed = computedValue.match(/\D*(\d+)\D*(\d+)\D*/) || ['', '', ''];
        setDefaultValue(moment(parsed[1], 'YYYY').add(parsed[2] - 1, 'Q'));
      }
    } else if (picker === 'week') {
      if (isArray) {
        const parsed1 = computedValue[0].match(/\D*(\d+)\D*(\d+)\D*/) || ['', '', ''];
        const parsed2 = computedValue[1].match(/\D*(\d+)\D*(\d+)\D*/) || ['', '', ''];
        setDefaultValue([
          moment(parsed1[1], 'YYYY').add(parsed1[2] - 1, 'weeks'),
          moment(parsed2[1], 'YYYY').add(parsed2[2] - 1, 'weeks'),
        ]);
      } else {
        const parsed = computedValue.match(/\D*(\d+)\D*(\d+)\D*/) || ['', '', ''];
        setDefaultValue(moment(parsed[1], 'YYYY').add(parsed[2] - 1, 'weeks'));
      }
    } else if (isArray) {
      const v1 = moment(computedValue[0], realFormat);
      const v2 = moment(computedValue[1], realFormat);
      setDefaultValue([v1, v2]);
    } else {
      setDefaultValue(moment(computedValue, realFormat));
    }
  }, [value]);

  if (rangePicker) {
    return (
      <RangePicker
        picker={picker}
        allowClear={allowClear}
        placeholder={placeholder}
        showTime={showTime}
        onChange={onChange}
        value={defaultValue}
      />
    );
  }

  return (
    <AntdDatePicker
      picker={picker}
      allowClear={allowClear}
      placeholder={placeholder}
      showTime={showTime}
      onChange={onChange}
      value={defaultValue}
    />
  );
};

DatePicker.isFieldComponent = true;

export default DatePicker;

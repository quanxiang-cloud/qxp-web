import React, { useEffect } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { AggType, RoundMethod } from './convertor';
import { get, isArray } from 'lodash';

interface Props {
  appID: string;
  tableID: string;
  fieldName: string,
  aggType: AggType,
  decimalPlaces: number,
  displayFieldNull: '0' | '-',
  value?: number;
  roundDecimal: RoundMethod,
  onChange?: (data: any) => void;
  linkStatistics?: boolean,
}

function SummaryField(props: Props): JSX.Element {
  // todo: compute statistic value by props
  const { onChange } = props;
  useEffect(()=>{
    onChange && onChange(props.value);
  }, []);
  return (
    <div>{props.value}</div>
  );
}

function SummaryFieldWrap(props: ISchemaFieldComponentProps): JSX.Element {
  const comProps = props.props['x-component-props'];
  // todo handle props.readOnly
  const componentProps = get(props, 'props.x-component-props');
  const { linkStatistics, aggType, roundDecimal, decimalPlaces, fieldName, displayFieldNull, dataRange, condition } = componentProps;
  const _value = get(props, 'value');

  const formatRound = (num: number) => {
    switch (roundDecimal) {
    case 'round':
      return Math.round(num);
    case 'round-up':
      return Math.ceil(num);
    case 'round-down':
      return Math.floor(num);
    }
  };

  const getSum = ()=>{
    let sum = 0;
    _value?.forEach((item: any)=>{
      const fieldNameNum = item?.[fieldName] || 0;
      sum = sum + fieldNameNum;
    });
    return decimalPlaces === 0 ? formatRound(sum) : sum.toFixed(decimalPlaces);
  };

  const getMax = ()=>{
    let max: any;
    _value?.forEach((item: any)=>{
      const fieldNameNum = item?.[fieldName] || 0;
      if (!max) {
        max = fieldNameNum;
      }
      if (fieldNameNum > max) {
        max = fieldNameNum;
      }
    });
    return max.toFixed(decimalPlaces);
  };

  const getMin = ()=>{
    let min: any;
    _value?.forEach((item: any)=>{
      const fieldNameNum = item?.[fieldName] || 0;
      if (!min) {
        min = fieldNameNum;
      }
      if (fieldNameNum < min) {
        min = fieldNameNum;
      }
    });
    return min.toFixed(decimalPlaces);
  };

  const getAvg = ()=>{
    let sum = 0;
    _value?.forEach((item: any)=>{
      const fieldNameNum = item?.[fieldName] || 0;
      sum = sum + fieldNameNum;
    });
    const avg = sum / _value?.length;
    return decimalPlaces === 0 ? formatRound(avg) : avg.toFixed(decimalPlaces);
  };

  const getValue = ()=>{
    if (!linkStatistics || !isArray(_value)) {
      return !isNaN(Number(_value)) ? _value : displayFieldNull;
      // return typeof _value === 'number' ? _value : displayFieldNull;
    }

    switch (aggType) {
    case 'count':
      return _value?.length;
    case 'sum':
      return getSum();
    case 'max':
      return getMax();
    case 'min':
      return getMin();
    case 'avg':
      return getAvg();
    }
  };

  props.mutators.change(getValue() || displayFieldNull);

  return (
    <SummaryField {...comProps} value={getValue() || displayFieldNull} />
  );
}

SummaryFieldWrap.isFieldComponent = true;

export default SummaryFieldWrap;

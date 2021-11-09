import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { AggType, RoundMethod } from './convertor';

interface Props {
  appID: string;
  tableID: string;
  fieldName: string,
  aggType: AggType,
  decimalPlaces: number,
  displayFieldNull: '0' | '-',
  value?: number;
  roundDecimal: RoundMethod,
}

function SummaryField(props: Props): JSX.Element {
  // todo: compute statistic value by props

  return (
    <div>{typeof props.value === 'number' ? props.value : props.displayFieldNull}</div>
  );
}

function SummaryFieldWrap(props: ISchemaFieldComponentProps): JSX.Element {
  const comProps = props.props['x-component-props'];

  // todo handle props.readOnly

  return (
    <SummaryField {...comProps} value={props.value} />
  );
}

SummaryFieldWrap.isFieldComponent = true;

export default SummaryFieldWrap;

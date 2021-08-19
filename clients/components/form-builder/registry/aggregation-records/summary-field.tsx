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
  roundDecimal: RoundMethod,
}

function SummaryField(props: Props) {
  // todo: compute statistic value by props
  return (
    <div>{props.displayFieldNull}</div>
  );
}

function SummaryFieldWrap(props: ISchemaFieldComponentProps): JSX.Element {
  const comProps = props.props['x-component-props'];

  return (
    <SummaryField {...comProps} />
  );
}

SummaryFieldWrap.isFieldComponent = true;

export default SummaryFieldWrap;

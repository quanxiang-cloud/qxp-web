import React, { useEffect } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { useQuery } from 'react-query';
import { getSerial } from './api';

type SerialProps = {
    appID: string;
    template: string;
    fieldID: string;
}

function SerialNumber(props: SerialProps & ISchemaFieldComponentProps): JSX.Element {
  const { appID } = props.props['x-component-props'];
  const fieldID = props.props.key;
  const { isLoading, data } = useQuery<any, Error>(
    [appID, fieldID],
    () => getSerial(appID, fieldID),
  );
  useEffect(()=>{
    props.mutators.change(data?.value);
  }, [data]);
  return (
    <p>{props.value}</p>
  );
}

SerialNumber.isFieldComponent = true;

export default SerialNumber;

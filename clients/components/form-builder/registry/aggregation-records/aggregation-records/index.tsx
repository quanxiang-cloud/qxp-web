import React, { useContext, useState } from 'react';
type Props = {
  appID: string;
  tableID: string;
  tableName: string,
  fieldName: string,
  aggType: string,
  onChange: (selectedKeys: string[]) => void;
}

function AggregationRecords({
  appID, tableID, tableName, fieldName, aggType, onChange,
}: Props): JSX.Element {
  return (
    <input type="text" value='0'/>
  );
}

export default AggregationRecords;

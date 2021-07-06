import React from 'react';

import Avatar from '@c/avatar';

interface Props {
  operation: OperationRecord;
}

export default function NoHandle({ operation }: Props): JSX.Element {
  const { creatorName } = operation;

  return (
    <div className="mb-16 px-16 py-12 bg-white flex items-center justify-between corner-2-8-8-8">
      <div className="flex items-center">
        <Avatar username={creatorName.substring(0, 1)} />
        <div className="text-h6-bold ml-8">{creatorName}</div>
      </div>
    </div>
  );
}

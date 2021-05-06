import React from 'react';
import { useHistory } from 'react-router';

export default function ApprovalCard(): JSX.Element {
  const history = useHistory();
  function handleClick() {
    history.push('/approvals/some_approval_id');
  }

  return (
    <div onClick={handleClick} className="p-20 input-border-radius bg-white mb-16">
      <h1>会议室预定</h1>
      <h1>会议室预定</h1>
      <h1>会议室预定</h1>
    </div>
  );
}

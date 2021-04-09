import React from 'react';
import classnames from 'classnames';

interface Props {
  key: number;
  page: number;
  active: boolean;
  onClick(): void;
}

function Pager({ page, active, onClick }: Props) {
  return (
    <li
      onClick={onClick}
      className={classnames('pagination-page', { active })}
    >
      {page}
    </li>
  );
}

export default Pager;

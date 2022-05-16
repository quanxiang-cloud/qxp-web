import React from 'react';
import Icon from '@one-for-all/icon';
import cs from 'classnames';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const searchControlIcon = ({ value, onChange }: Props): JSX.Element => {
  const baseClassName = 'absolute transition-all duration-240';
  const SearchClassName = cs(baseClassName, {
    'opacity-0 pointer-events-none': value,
  });
  const CloseClassName = cs(baseClassName, {
    'opacity-100 cursor-pointer': value,
    'opacity-0 pointer-events-none': !value,
  });

  return (
    <span className="absolute right-10 top-5 inline-block w-16 h-16">
      <Icon name="search" className={SearchClassName} />
      <span className={CloseClassName} onClick={() => onChange('')}>
        <Icon name="close" />
      </span>
    </span>
  );
};

export default searchControlIcon;

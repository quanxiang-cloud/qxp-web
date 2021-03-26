import React from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

export interface IEmptyData {
  text: string;
  className?: string;
}

export const EmptyData = ({ text, className }: IEmptyData) => {
  return (
    <div className={twCascade('flex flex-col justify-center items-center', className)}>
      <img src="/dist/images/links.svg" alt="no data" className="mb-8" />
      <span className={twCascade('text-12')}>{text}</span>
    </div>
  );
};

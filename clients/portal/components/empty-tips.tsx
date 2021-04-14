import React from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

export interface Props {
  text: string;
  className?: string;
}

export default function EmptyTips({ text, className }: Props) {
  return (
    <div className={twCascade('flex flex-col justify-center items-center', className)}>
      <img src="/dist/images/links.svg" alt="no data" className="mb-8" />
      <span className={twCascade('text-12')}>{text}</span>
    </div>
  );
}

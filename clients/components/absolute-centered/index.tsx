import React from 'react';

type Props = {
  children: React.ReactNode,
  className?: string,
}

const style: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
};

function AbsoluteCentered({ className = '', children }: Props) {
  return (
    <div style={style} className={className}>
      { children}
    </div>
  );
}

export default AbsoluteCentered;

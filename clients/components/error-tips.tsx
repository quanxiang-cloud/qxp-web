import React from 'react';

interface IError {
  desc?: string;
  style?: React.CSSProperties;
}

export default function Error({ desc = '404 Not Found', style }: IError): JSX.Element {
  return (
    <div className="w-full h-full flex justify-center items-center flex-1 text-h3" style={style}>
      {desc}
    </div>
  );
}

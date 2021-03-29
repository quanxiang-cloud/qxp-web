import React from 'react';

interface IError {
  desc?: string;
}

export const Error = ({ desc = '404 Not Found' }: IError) => {
  return (
    <div className="w-full h-full flex justify-center items-center flex-1 text-h3">
      {desc}
    </div>
  );
};

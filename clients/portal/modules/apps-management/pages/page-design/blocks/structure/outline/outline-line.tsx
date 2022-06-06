import React from 'react';

export default function OutlineLine({ level }: { level: number }): JSX.Element {
  return (
    <>
      {new Array(level).fill(1).map((_, index) => (
        <span
          key={index}
          className="w-1 h-full absolute bg-gray-300 z-10"
          style={{ left: (index * 20) + 11 }}
        />
      ))}
    </>
  );
}

import React from 'react';

interface Props {
  name?: string;
  link?: string;
}

const bgColors: string[] = ['#6366F1', '#10B981', '#F59E0B', '#EF4444'];

const getBgColorByName = (name: string) => {
  const idx = name.charCodeAt(0) % 3;
  return bgColors[idx];
}

function Avatar({ name, link }: Props) {
  if (link) {
    return (
      <div className="inline-flex justify-center items-center rounded-4 rounded-tr-none w-24 h-24">
        <img src={link} alt="" className="w-full h-full" />
      </div>
    )
  }

  const firstLetter = (name || '')[0];
  return (
    <div
      className="inline-flex justify-center items-center rounded-4 rounded-tr-none w-24 h-24 text-white text-lg"
      style={{ backgroundColor: getBgColorByName(firstLetter) }}
    >
      {firstLetter}
    </div>
  );
}

export default Avatar;

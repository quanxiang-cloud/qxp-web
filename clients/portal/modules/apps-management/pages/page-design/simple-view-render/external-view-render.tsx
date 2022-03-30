import React from 'react';

type Props = {
  name: string;
  link: string;
}

export default function ExternalViewRender({ name, link }: Props): JSX.Element {
  return (
    <div className="w-full h-full">
      <iframe
        className="w-full h-full"
        src={link}
        style={{ border: 'none' }}
      />
    </div>
  );
}

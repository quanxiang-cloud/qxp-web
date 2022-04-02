import React from 'react';

type Props = {
  fileUrl: string;
}

export default function StaticViewRender({ fileUrl }: Props): JSX.Element {
  return (
    <div className="w-full h-full">
      <iframe
        className="w-full h-full"
        src={fileUrl}
        style={{ border: 'none' }}
      />
    </div>
  );
}

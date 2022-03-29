import React from 'react';

type Props = {
  ctx: any
}

export default function ExternalViewRender(props: Props): JSX.Element {
  console.log(props);

  return (
    <div>
      ExternalViewRender
    </div>
  );
}

import React from 'react';

type Props = {
  ctx: any
}

export default function StaticViewRender(props: Props): JSX.Element {
  console.log(props);

  return (
    <div>
      StaticViewRender
    </div>
  );
}

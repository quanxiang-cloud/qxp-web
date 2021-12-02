import React from 'react';

import Icon from '@c/icon';

interface Props {
  title: string;
  desc: string;
}

function ModalRemoveTips({ title, desc }: Props): JSX.Element {
  return (
    <div className="flex flex-col">
      <div className="mb-8 flex items-center">
        <Icon name="info" className="text-yellow-600 mr-8" size={20} />
        <span className="text-h6-no-color-weight font-semibold text-yellow-600">{title}</span>
      </div>
      <div className="text-h6-no-color-weight text-gray-900 pl-28">{desc}</div>
    </div>
  );
}

export default React.memo(ModalRemoveTips, (prevProps: Props, nextProps: Props) => {
  return prevProps.title === nextProps.title && prevProps.desc === nextProps.desc;
});

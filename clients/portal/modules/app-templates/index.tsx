import React from 'react';

import TextHeader from '@c/text-header';

function AppTemplates(): JSX.Element {
  return (
    <div className="app-templates">
      <TextHeader
        title="模版库"
        desc="……"
        // action="👋 快速开始"
        className="app-list-headertitle bg-gray-1000 px-20 py-16 header-background-image"
        itemTitleClassName="text-h6"
      />
    </div>
  );
}

export default AppTemplates;

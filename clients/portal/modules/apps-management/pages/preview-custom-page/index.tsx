import React from 'react';

import appPageStore from '../app-details/store';

import PreviewHeader from './header';

function PreviewCustomPage() {
  const { curPreviewUrl, curPage } = appPageStore;

  return (
    <div className='flex flex-col preview-header'>
      <PreviewHeader pageName={curPage.name || ''} />
      <iframe
        className="w-full h-full"
        src={curPreviewUrl}
        style={{ border: 'none' }}
      />
    </div>
  );
}

export default PreviewCustomPage;

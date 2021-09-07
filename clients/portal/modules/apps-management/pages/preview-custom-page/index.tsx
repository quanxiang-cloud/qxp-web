import React from 'react';

import appPageStore from '../app-details/store';

import PreviewHeader from './header';

function PreviewCustomPage() {
  const { curPreviewUrl, curPage } = appPageStore;

  return (
    <>
      <PreviewHeader pageName={curPage.name || ''} />
      <div style={{
        height: 'calc(100% - 52px)',
      }}>
        <iframe
          className="w-full h-full"
          src={curPreviewUrl}
          style={{ border: 'none' }}
        />
      </div>
    </>
  );
}

export default PreviewCustomPage;

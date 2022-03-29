import React from 'react';

export default function AppLand(): JSX.Element {
  return (
    <div style={{ height: '100vh' }}>
      <div data-internal-node="true" data-layout="true" data-layout-type="header-content">
        <div data-layout-child="fragment-container">
          <div></div>
        </div>
        <div data-layout-child="routes-container">
          <div data-internal-node="true" data-layout="true" data-layout-type="header-content">
            <div data-layout-child="fragment-container">
              <div></div>
            </div>
            <div data-layout-child="routes-container">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

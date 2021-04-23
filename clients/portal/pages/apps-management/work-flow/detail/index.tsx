import React, { useState } from 'react';

import AsideMenu from './aside-menu';
import Content from './content';

import './style.scss';

export default function Detail() {
  const [currentOperateType, setCurrentOperateType] = useState<
    'edit' | 'settings' | 'variables'
  >('edit');

  return (
    <section className="flex-1 flex">
      <AsideMenu onChange={setCurrentOperateType} currentOperateType={currentOperateType} />
      <Content currentOperateType={currentOperateType} />
    </section>
  );
}

import React, { useState } from 'react';

import Modal from '@c/modal';
import Tab from '@c/tab';

import ImportEmployees from '../export-import-employees/import-employees';
import ExportEmployees from '../export-import-employees/export-employees';

type Props = {
  closeModal(): void;
}

export default function ImportExportEmployeesModal({ closeModal }: Props): JSX.Element {
  const [confirmText, setConfirmText] = useState('确定导入');

  function handleChangeTab(key: string): void {
    if (key === 'import-employees') {
      setConfirmText('确定导入');
    } else if (key === 'export-employees') {
      setConfirmText('确定导出');
    }
  }

  return (
    <Modal
      title="Excel 批量导入/导出"
      className='static-modal'
      width={1234}
      height={760}
      onClose={closeModal}
      footerBtns={[
        {
          text: confirmText,
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: closeModal,
        },
        {
          text: '关闭',
          key: 'cancel',
          iconName: 'close',
          onClick: closeModal,
        },
      ]}
    >
      <div className="p-20">
        <Tab
          items={[
            { id: 'import-employees', name: 'Excel批量导入', content: <ImportEmployees currDepId='1' /> },
            { id: 'export-employees', name: 'Excel批量导出', content: <ExportEmployees /> },
          ]}
          onChange={handleChangeTab}
        />
      </div>
    </Modal>
  );
}

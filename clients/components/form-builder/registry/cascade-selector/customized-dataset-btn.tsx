import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Button from '@c/button';
import Modal from '@c/modal';

type EditDatasetModalProps = {
  options: FormBuilder.CascadeOption[];
  onClose: () => void;
  onSave: (options: FormBuilder.CascadeOption[]) => void;
}

function EditDatasetModal({ onClose, onSave }: EditDatasetModalProps): JSX.Element {
  function fakeSave() {
    onSave([
      {
        value: 'foo',
        label: 'foo',
      },
      {
        value: 'bar',
        label: 'bar',
      },
      {
        value: 'bax',
        label: 'bax',
        children: [
          {
            value: 'baz',
            label: 'baz',
          },
        ],
      },
    ]);
  }

  return (
    <Modal
      footerBtns={[
        {
          key: 'cancel',
          text: '取消',
          onClick: onClose,
        },
        {
          key: 'save',
          text: '保存',
          onClick: fakeSave,
        },
      ]}
    >
      hello world
    </Modal>
  );
}

function CustomizedDatasetBtn({ mutators, value }: ISchemaFieldComponentProps): JSX.Element {
  const [showEditDatasetModal, setModalVisible] = React.useState(false);

  return (
    <>
      <Button onClick={() => setModalVisible(true)}>设置数据集</Button>
      {
        showEditDatasetModal && (
          <EditDatasetModal
            options={value}
            onClose={() => setModalVisible(false)}
            onSave={(options) => {
              mutators.change(options);
              setModalVisible(false);
            }}
          />
        )
      }
    </>
  );
}

CustomizedDatasetBtn.isFieldComponent = true;

export default CustomizedDatasetBtn;

import React, { useRef } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Button from '@c/button';
import Modal from '@c/modal';
import EditableTree, { RefType } from '@c/editable-tree';

type EditDatasetModalProps = {
  options: FormBuilder.CascadeOption[];
  onClose: () => void;
  onSave: (options: FormBuilder.CascadeOption[]) => void;
}

function EditDatasetModal({ onClose, onSave, options }: EditDatasetModalProps): JSX.Element {
  const treeRef = useRef<RefType>(null);

  const handleSave = () => {
    const treeData = treeRef.current?.getValues();
    if (treeData) {
      onSave(treeData);
    }
  };

  return (
    <Modal
      title="设置级联选项"
      onClose={onClose}
      footerBtns={[
        {
          key: 'cancel',
          text: '取消',
          onClick: onClose,
        },
        {
          key: 'save',
          text: '保存',
          onClick: handleSave,
        },
      ]}
    >
      <EditableTree
        className="p-20"
        initialValue={options}
        ref={treeRef}
        onSave={(tree)=> tree}
        hideSaveBtn
      />
    </Modal>
  );
}

function CustomizedDatasetBtn({ mutators, value }: ISchemaFieldComponentProps): JSX.Element {
  const [showEditDatasetModal, setModalVisible] = React.useState(false);

  return (
    <>
      <Button onClick={() => setModalVisible(true)}>设置</Button>
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

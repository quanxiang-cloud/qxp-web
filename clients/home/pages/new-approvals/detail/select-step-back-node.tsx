import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from '@c/select';

import { getStepbackActivityList } from '../api';

interface Props {
  className?: string;
  onChange: (id: string) => void;
}

type StepBackNode = {
  id: string;
  taskDefKey: string;
  taskName: string;
  processInstanceId: string;
}

function SelectStepBackNode({ onChange }: Props) {
  const { processInstanceID } = useParams<{ processInstanceID: string }>();
  const [stepBackNodes, setNodes] = useState<Array<StepBackNode>>([]);

  useEffect(() => {
    getStepbackActivityList(processInstanceID).then((nodes) => {
      setNodes((prevNodes) => nodes);
    });
  }, []);

  return (
    <Select
      className="mb-24"
      options={stepBackNodes.map(({ taskDefKey, taskName }) => ({
        label: taskName,
        value: taskDefKey,
      }))}
      onChange={onChange}
      placeholder={<span className="text-gray-400">选择要回退到的节点</span>}
    />
  );
}

export default SelectStepBackNode;

import { Icon } from '@one-for-all/ui';
import React, { useState, useEffect } from 'react';
import UrlInput from './url-input';

export interface UrlInputGroupsProps {
  value: string[];
  onChange: (val: string[]) => void;
}

function UrlInputGroup({ value, onChange }: UrlInputGroupsProps): JSX.Element {
  const [urlStrings, setUrlStrings] = useState<string[]>(value);

  useEffect(() => {
    onChange(urlStrings);
  }, [urlStrings]);

  function addInput() {
    setUrlStrings([...urlStrings, '']);
  }

  return (
    <div className="flex flex-col">
      {urlStrings.map((url, index) => (
        (<div className='flex justify-between items-center mb-4 flex-1' key={`url${index}`}>
          <UrlInput
            value={url}
            onChange={(val) => {
              urlStrings[index] = val;
              setUrlStrings([...urlStrings]);
            }}
          ></UrlInput>
          <span onClick={() => {
            urlStrings.splice(index, 1);
            setUrlStrings([...urlStrings]);
          }}>
            <Icon name="delete" size={24} />
          </span>
        </div>)
      ))}
      <div className="flex justify-end">
        <span onClick={addInput}>
          <Icon name="add" size={24} />
        </span>
      </div>
    </div>
  );
}

export default UrlInputGroup;

import { observer } from 'mobx-react';
import React from 'react';

import store from '../store';
import DesignTokenStore from './store';

const errorStyle = {
  background: '#FEF2F2',
  border: '1px solid #DC2626',
  color: '#DC2626',
};

function JSONEditor({
  stringTokens,
  handleChange,
  error,
}: {
  stringTokens: string;
  handleChange: (tokens: string) => void;
  error: string;
}): JSX.Element {
  const { isEditDisabled } = store.designTokenStore as DesignTokenStore;

  return (
    <div className="flex-1 relative p-10">
      <textarea
        className='w-full h-full outline-none resize-none'
        rows={21}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isEditDisabled}
        value={stringTokens}
      />
      { error && <p className='absolute bottom-0 left-0 w-full text-center ' style={errorStyle}>{error}</p> }
    </div>
  );
}
export default observer(JSONEditor);

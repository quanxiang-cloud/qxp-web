import React from 'react';

import SearchInput from '@c/form/input/search-input';

interface Props {
  onChange: (value: any) => void;
}

export default function APINamespaceSearch({ onChange }: Props): JSX.Element {
  return (
    <SearchInput
      className="polynamespacedetail-header-searchinput"
      name="apiName"
      placeholder="搜索 分组名称..."
      onChange={onChange}
      appendix="close"
    />
  );
}

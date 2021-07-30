import React from 'react';
import Icon from '@c/icon';

import { observer } from 'mobx-react';

type Props = {
  formItem: FormBuilder.SourceElement<any>;
}

function SourceElement(props: Props): JSX.Element {
  const { formItem } = props;
  const id = `form_builder_${formItem.componentName}`;

  return (
    <div data-id={id} className="source-element-section--element" >
      <Icon name={formItem.icon} size={20} className="mr-6" />
      {formItem.displayName}
    </div>
  );
}

export default observer(SourceElement);

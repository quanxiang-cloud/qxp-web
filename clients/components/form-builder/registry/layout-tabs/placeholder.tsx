
/**
 * feat: layout-tabs placeholder component in canvas builder
 */
import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { observer } from 'mobx-react';
import { values } from 'lodash';

import { StoreContext } from '@c/form-builder/context';
import FieldRender from '@c/form-builder/components/field-render';
import { EmptyLayout } from '@c/form-builder/components/empty-layout';
import { sortProperties } from '@c/form-builder/utils';
import { getFieldId } from '@c/form-builder/utils/fields-operator';

type TabPositin = 'left' | 'right' | 'top' | 'bottom';

const { TabPane } = Tabs;

function Placeholder(props: ISchema): JSX.Element | null {
  const [innerFields, setInnerFields] = React.useState<ISchema[]>([]);
  const [activeKey, setActiveKey] = React.useState('');
  const store = React.useContext(StoreContext);

  const { properties } = props;
  const xComponentProps = props['x-component-props'] || {};

  const pId = getFieldId(props);

  const { tabs } = xComponentProps;

  useEffect(() => {
    const curAct = store.tabsActiveList?.[pId] || tabs[0];
    setActiveKey(curAct);
  }, [store.schema, store.flattenFields, store.tabsActiveList]);

  useEffect(() => {
    store.setTabsActiveList(pId, tabs[0]);
  }, []);

  React.useEffect(() => {
    const currentActiveTabPane: ISchema[] = values(properties)
      .filter((p: ISchema) => p['x-internal']?.tabIndex === activeKey);

    setInnerFields(currentActiveTabPane);
  }, [activeKey, store.schema, store.flattenFields]);

  const position: TabPositin = xComponentProps?.position || 'top';

  const filterCurrentTabPropertyies = (_innerFields: ISchema[]): { properties: ISchema } => {
    const currentTabIndexFields =
      _innerFields.filter((field) => field?.['x-internal']?.tabIndex === activeKey);

    return {
      properties: sortProperties(currentTabIndexFields),
    };
  };

  const handleActiveKey = (activeKey: string): void => {
    setActiveKey(activeKey);
    store.setTabsActiveList(pId, activeKey);
  };

  return (
    <Tabs activeKey={activeKey} tabPosition={position} onChange={handleActiveKey}>
      {tabs.length && tabs.map((label: string) => (
        <TabPane tab={label} key={label}>
          <div className='min-h-32 border-b6 layout-grid'>
            {!innerFields.length ?
              <EmptyLayout pId={pId} tabIndex={activeKey} /> :
              <FieldRender schema={filterCurrentTabPropertyies(innerFields) as ISchema} />}
          </div>
        </TabPane>
      ))}
    </Tabs>
  );
}

export default observer(Placeholder);

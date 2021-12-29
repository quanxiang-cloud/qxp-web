
/**
 * feat: layout-tabs placeholder component in canvas builder
 */
import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { observer } from 'mobx-react';
import { isString, values } from 'lodash';

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

  const pid = getFieldId(props);

  const { tabs } = xComponentProps;

  useEffect(() => {
    const activeKey = isString(tabs[0]) ? tabs[0] : tabs[0].value;
    let curAct = store.tabsActiveList?.[pid] || activeKey;
    if (!tabs.find((tab: string | LabelValue) => !isString(tab) && tab.value === curAct)) {
      curAct = activeKey;
    }
    setActiveKey(curAct);
  }, [store.schema, store.flattenFields, store.tabsActiveList, tabs.length]);

  useEffect(() => {
    values(properties).forEach((p: ISchema) => {
      const { fieldId, parentFieldId } = (p['x-internal'] as XInternal);
      let tabIndex = (p['x-internal'] as XInternal).tabIndex;
      const index = p['x-index'];

      const tabsValues = tabs.filter((tab: LabelValue | string) => !isString(tab));

      tabsValues.forEach((tab: LabelValue) => {
        if (tabIndex === tab.label && fieldId && index) {
          store.update({
            fieldId: fieldId,
            parentFieldId,
            index,
            tabIndex: tab.value,
          });
          tabIndex = tab.value;
        }
      });

      if (
        tabsValues.length &&
        !tabsValues.map((tab: LabelValue) => tab.value).includes(tabIndex) &&
        fieldId &&
        tabIndex
      ) {
        store.deleteField(fieldId);
      }
    });
  }, [tabs]);

  useEffect(() => {
    store.setTabsActiveList(pid, tabs[0].value);
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
    store.setTabsActiveList(pid, activeKey);
  };

  return (
    <Tabs activeKey={activeKey} tabPosition={position} onChange={handleActiveKey}>
      {
        tabs.length && tabs.map((tab: string | LabelValue) => {
          const label = isString(tab) ? tab : tab.label;
          const value = isString(tab) ? tab : tab.value;

          return (
            <TabPane tab={label} key={value}>
              <div className='min-h-32 border-b6 layout-grid'>
                {!innerFields.length ?
                  <EmptyLayout pid={pid} tabIndex={activeKey} /> :
                  <FieldRender schema={filterCurrentTabPropertyies(innerFields) as ISchema} />}
              </div>
            </TabPane>
          );
        })
      }
    </Tabs>
  );
}

export default observer(Placeholder);

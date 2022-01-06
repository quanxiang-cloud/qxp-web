import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { Tabs } from 'antd';
import { isString } from 'lodash';

const { TabPane } = Tabs;

function LayoutTabs(p: ISchemaFieldComponentProps): JSX.Element {
  const tabs: (LabelValue | string)[] = (p.props?.['x-component-props']?.tabs || []);
  const position = p.props?.['x-component-props']?.position;

  return (
    <div className="layout-tabs">
      <Tabs defaultActiveKey={isString(tabs[0]) ? tabs[0] : tabs[0].value} tabPosition={position}>
        {
          Array.from(
            new Set(tabs.filter((itm) => (isString(itm) ? itm : itm.value))),
          ).map((tab: string | LabelValue) => {
            const label = isString(tab) ? tab : tab.label;
            const value = isString(tab) ? tab : tab.value;

            return (
              <TabPane tab={label} key={value} forceRender={true}>
                {
                  React.Children.toArray(p.children).filter(((itm: any) => {
                    return itm?.props?.schema?.['x-internal']?.tabIndex === value;
                  }))
                }
              </TabPane>
            );
          })
        }
      </Tabs>
    </div>
  );
}

LayoutTabs.isVirtualFieldComponent = true;

export default LayoutTabs;

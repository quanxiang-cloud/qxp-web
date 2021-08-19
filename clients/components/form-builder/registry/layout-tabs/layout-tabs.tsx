import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

function LayoutTabs(p: ISchemaFieldComponentProps): JSX.Element {
  const tabs: string[] = (p.props?.['x-component-props']?.tabs || []);
  const position = p.props?.['x-component-props']?.position;

  return (
    <div className="layout-tabs">
      <Tabs defaultActiveKey={tabs[0]} tabPosition={position}>
        {Array.from(new Set(tabs.filter((itm) => !!itm))).map((label) => (
          <TabPane tab={label} key={label}>
            {React.Children.toArray(p.children).filter(((itm: any) => {
              return itm?.props?.schema?.['x-internal']?.tabIndex === label;
            }))}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
}

LayoutTabs.isVirtualFieldComponent = true;

export default LayoutTabs;

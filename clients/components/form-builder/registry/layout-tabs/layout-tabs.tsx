import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

function LayoutTabs(p: ISchemaFieldComponentProps): JSX.Element {
  const tabs: LabelValue[] = (p.props?.['x-component-props']?.tabs || []);
  const position = p.props?.['x-component-props']?.position;

  return (
    <div className="layout-tabs">
      <Tabs defaultActiveKey={tabs[0].value} tabPosition={position}>
        {
          Array.from(new Set(tabs.filter((itm) => !!itm.value))).map(({ label, value }) => {
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

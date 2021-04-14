import React, { useState } from 'react';
import { Tabs, Divider, Button, Space } from 'antd';
import styled from 'styled-components';
import CodeEditor from './elements/CodeEditor/CodeEditor';
import { createTooltipLabel, string2Json } from './utils';

const { TabPane } = Tabs;

const HelpWrapper = styled.div`
  //position: absolute;
  //top: 0;
  //left: 0;
  //width: 100%;
  //z-index: 9;
`;

const CloseHelp = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0 5px;
  cursor: pointer;
  background-color: #fff;
  z-index: 9;
  margin: 1px;
`;

const StyledTabPane = styled(TabPane)`
  position: relative;
`;

const linkageHelp = `
// 联动表达式的上下文注入了一些环境变量：
{
  ...formContext, // 全局上下文，在全局变量设置里面设置
  $value, // 代表当前字段的值
  $self, // 代表当前字段的值
  $form, // 代表当前表单实例
  $target, // 代表目标字段的状态
},
// 联动协议, 目前内置 3 种联动类型：
// 1. value:visible, 由值变化控制指定字段的显示隐藏
// 2. value:schema, 由值变化控制字段的 schema
// 3. value:state, 由值变化控制指定字段的状态

// 示例：
{
  aaa: [ // 表单 key
    {
      type: 'value:schema',
      target: 'bbb',
      condition: '{{$value !== 1}}',
      schema: {
        title: '这是bbb新的标题', // 当 aaa 表单的值不等于 1 时，bbb 表单的 title 设置为'这是 bbb 的新标题'
      },
      otherwise: {
        title: '这是 bbb 的原标题',
      },
    },
    {
      type: 'value:state',
      target: 'bbb',
    //condition: null, // condition 不设置，则默认执行设置的联动规则
      state: {
        value: 123, // 无论什么条件，设置 bbb 的值为 123，
      },
    },
    {
      type: 'value:visible',
      target: 'ccc',
      condition: '{{$value !== 3}}', // aaa 值不为 3 时，显示出 ccc 表单，否则隐藏
    },
  ],
}`;

const LinkageSettingModal = ({
  linkages,
  formContext,
  setLinkages,
  setFormContext,
  closeModal,
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const [linkageValue, setLinkageValue] = useState(JSON.stringify(linkages, null, 2));
  const handleLinkageChange = value => {
    setLinkageValue(value);
  };

  const [contextValue, setContextValue] = useState(JSON.stringify(formContext, null, 2));
  const handleContextChange = value => {
    setContextValue(value);
  };

  const toggleShowHelp = () => {
    setShowHelp(!showHelp);
  };

  const handleSaveLinkage = () => {
    const newLinkages = string2Json(linkageValue);
    setLinkages(newLinkages);
    closeModal();
  };

  const handleSaveFormContext = () => {
    const newFormContext = string2Json(contextValue);
    setFormContext(newFormContext);
    closeModal();
  };

  const linkageTab = createTooltipLabel('联动设置', '设置说明', toggleShowHelp);

  return (
    <Tabs>
      <StyledTabPane tab={linkageTab} key="linkage">
        {showHelp ? (
          <HelpWrapper>
            <CodeEditor
              value={linkageHelp}
              languageSelector={false}
              language="application/json"
              lineNumbers={false}
              height={400}
              readOnly
            />
            <CloseHelp
              onClick={() => {
                setShowHelp(false);
              }}
            >
              关闭说明
            </CloseHelp>
          </HelpWrapper>
        ) : (
          <>
            <CodeEditor
              value={linkageValue}
              onChange={handleLinkageChange}
              languageSelector={false}
              language="application/json"
            />
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Space>
                <Button onClick={closeModal}>取消</Button>
                <Button onClick={handleSaveLinkage} type="primary">
                  保存
                </Button>
              </Space>
            </div>
          </>
        )}
      </StyledTabPane>
      <TabPane tab="全局变量" key="expressionScope">
        <>
          <CodeEditor
            value={contextValue}
            onChange={handleContextChange}
            languageSelector={false}
            language="application/json"
          />
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Space>
              <Button onClick={closeModal}>取消</Button>
              <Button onClick={handleSaveFormContext} type="primary">
                保存
              </Button>
            </Space>
          </div>
        </>
      </TabPane>
    </Tabs>
  );
};

export default LinkageSettingModal;

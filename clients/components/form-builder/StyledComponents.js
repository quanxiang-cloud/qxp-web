import styled from 'styled-components';

export const FormBuilderDiv = styled.div`
  display: flex;
  font-size: 12px;

  .panel-title {
    font-weight: 500;
    color: #323d58;
  }

  .canvas-container {
    margin-top: 12px;
    padding: 0 8px;
    height: calc(100% - 30px);
    border: 2px dashed transparent;
    overflow-y: auto;

    &.drop-class-inside {
      border-color: #d5dce7;
    }
  }

  .mega-layout-container {
    & > .ant-col {
      max-width: 100%;
    }
  }

  .ant-form-horizontal .ant-form-item-label {
    min-width: unset;
  }

  .wrapper-title {
    position: absolute;
    right: 10px;
    top: 0;
    font-size: 12px;
    background-color: ${(props) => props.theme.primaryColor};
    color: #fff;
    padding: 1px 3px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }
`;

export const LeftPanel = styled.div`
  width: 280px;
  padding: 12px 12px 0;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 3px 5px 0 rgba(213, 220, 231, 0.64), 0 0.5px 1px 0 rgba(174, 184, 193, 0.48);
`;

export const PanelTitle = styled.div`
  font-weight: 500;
  color: #323d58;
`;

export const EmptyPlaceholder = styled.div`
  display: flex;
  height: 150px;
  border: 1px dashed #d5dce7;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .text {
    margin-top: 8px;
    color: #939aa9;
  }
`;

export const RightPanel = styled.div`
  width: 330px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 3px 5px 0 rgba(213, 220, 231, 0.64), 0 0.5px 1px 0 rgba(174, 184, 193, 0.48);
  height: 100%;
  font-size: 12px;

  .setting-panel {
    height: 100%;
    font-size: 12px;
  }

  .ant-tabs-content-holder {
    height: 100%;
    overflow-y: auto;
  }

  .ant-slider {
    max-width: 200px;
  }

  .ant-form label {
    font-size: 12px;
  }

  .ant-tabs-small {
    & > .ant-tabs-nav {
      .ant-tabs-tab {
        font-size: 12px;
        padding: 12px 0;
      }
    }
  }

  .ant-tabs-nav-list {
    margin-left: 24px;
  }
  .ant-tabs-content {
    padding: 0 12px;
  }

  .enum-setting {
    margin-bottom: 24px;

    .enum-setting-tabs {
      background-color: #fff;
      padding: 5px 10px;

      .ant-tabs-nav {
        margin-bottom: 0;
      }

      .ant-tabs-nav-list {
        margin-left: unset;
      }

      .ant-tabs-content-holder {
        border: 1px solid #f0f0f0;
        border-top: 0;
        padding: 10px 0;
      }
    }

    .enum-setting-title {
      font-size: 12px;
      font-weight: 500;
      padding: 0 0 8px;
      margin-left: 10px;
    }

    .enum-setting-row-label {
      margin-right: 3px;
    }

    .field-setting-card {
      background-color: #fff;
      padding: 5px 10px;
    }

    .fields-title-row {
      display: flex;
      font-size: 12px;
      margin-bottom: 8px;
    }

    .fields-title,
    .fields-key {
      width: 90px;
    }

    .fields-columns-title,
    .fields-columns-key {
      width: 80px;
    }
  }

  .enum-setting-row {
    display: flex;

    .ant-form-item {
      margin-bottom: 12px;
    }
  }

  .enum-setting-actions {
    margin-left: 5px;
    display: flex;

    .ant-btn {
      padding: 4px 8px;

      .icon {
        vertical-align: middle;
      }

      &:first-child {
        margin-right: 3px;
      }
    }
  }

  .virtual-form-item {
    .ant-input {
      border: none;
      background-color: transparent;
    }
  }

  .enum-checked {
    margin-right: 5px;
  }

  .hidden-form-item {
    display: none;
  }
`;

export const MainPanel = styled.div`
  flex: 1;
  margin: 0 16px;
  padding: 12px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 3px 5px 0 rgba(213, 220, 231, 0.64), 0 0.5px 1px 0 rgba(174, 184, 193, 0.48);

  .drag-row {
    position: relative;
    border: 2px solid transparent;
    padding: 20px 10px;
    margin-bottom: 5px;

    &.drop-class-up {
      border-top-color: ${(props) => props.theme.primaryColor};
    }
    &.drop-class-down {
      border-bottom-color: ${(props) => props.theme.primaryColor};
    }
    &.mouse-hover,
    &.is-active {
      border-color: ${(props) => props.theme.primaryColor};
    }

    &.is-active {
      > .drag-handler,
      > .btn-copy,
      > .btn-trash {
        visibility: visible;
      }
    }

    .inner-wrapper {
      width: 100%;
      min-height: 60px;
      border: 1px dashed #d5dce7;

      &.drop-class-inside {
        background: #ecf1f5;
      }
    }

    &:after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    &.row-container {
      &:after {
        content: none;
      }
    }

    .ant-form-item {
      margin-bottom: 0;
    }

    .drag-handler,
    .btn-copy,
    .btn-trash {
      visibility: hidden;
      position: absolute;
      padding: 3px 3px 0;
      background: ${(props) => props.theme.primaryColor};
      z-index: 9;

      .qicon {
        color: #fff;
      }
    }

    .drag-handler {
      cursor: move;
      top: 0;
      left: 0;
    }

    .btn-copy {
      cursor: pointer;
      right: 22px;
      bottom: 0;
    }

    .btn-trash {
      cursor: pointer;
      right: 0;
      bottom: 0;
    }

    .mega-layout-edit,
    .wrapper-outline {
      .inner-wrapper {
        border-color: ${(props) => props.theme.primaryColor};
      }
    }

    .mega-inline,
    .mega-grid {
      .drag-row {
        display: inline-block;
      }
    }
  }
`;

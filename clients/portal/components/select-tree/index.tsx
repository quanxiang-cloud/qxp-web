import React from 'react';
import PropTypes from 'prop-types';
import { Control, Icon } from '@QCFE/lego-ui';

import Tree from './tree';

type Props = {
  defaultSelect: any;
  treeData: any;
  onChange: (id: string) => void;
  onBlur: (id: string) => void;
  name: string;
  placeholder: string;
};

type State = {
  showSelectBox: boolean;
  width: string;
  showTips: boolean;
  selectValue: DeptInfo | string;
};

type Styles = {
  selectBox: React.CSSProperties;
  showSelectBox: React.CSSProperties;
  box: React.CSSProperties;
};

const styles: Styles = {
  selectBox: {
    position: 'fixed',
    transform: 'translateY(10px)',
    padding: '5px',
    zIndex: -999,
    visibility: 'hidden',
    backgroundColor: ' #fff',
    border: '1px solid #d5dee7',
    borderRadius: '3px',
    boxShadow: '0 6px 12px 0 rgba(2, 5, 8, 0.04), 0 1px 2px 0 rgba(2, 5, 8, 0.08)',
  },
  showSelectBox: {
    maxHeight: '350px',
    overflowY: 'auto',
    zIndex: 10,
    visibility: 'visible',
  },
  box: {
    position: 'relative',
    width: '100%',
    outline: '0',
  },
};

export default class SelectTree extends React.Component<Props> {
  static propTypes = {
    name: PropTypes.string.isRequired,
    defaultSelect: PropTypes.any,
    treeData: PropTypes.array,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    placeholder: PropTypes.string,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      showSelectBox: false,
      width: '300px',
      showTips: true,
      selectValue: '',
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.defaultSelect?.id === prevProps.defaultSelect?.id) {
      return;
    }

    this.setDefaultSelect();
  }

  componentDidMount() {
    const boxDom = document.getElementById('tree-select-box');
    if (boxDom) {
      this.setState({ width: boxDom.getBoundingClientRect().width + 'px' });
    }

    this.setDefaultSelect();
  }

  setDefaultSelect = () => {
    const { defaultSelect, treeData } = this.props;
    if (!defaultSelect || !treeData) {
      return;
    }

    this.setState({ selectValue: defaultSelect, showTips: false });
    this.handleValueChang(defaultSelect.id);
  };

  handleValueChang = (value: string) => {
    const { onChange, onBlur } = this.props;
    onChange instanceof Function && onChange(value);
    onBlur instanceof Function && onBlur(value);
  };

  handleSelect = (data: any) => {
    this.handleValueChang(data.id);
    this.setState({
      showSelectBox: false,
      showTips: false,
      selectValue: data,
    });
  };

  handleBlur = () => {
    this.setState({
      showSelectBox: false,
    });
  };

  handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    this.setState({
      selectValue: '',
      showTips: true,
    });
    this.handleValueChang('');
  };

  render() {
    const { showSelectBox, showTips, selectValue, width } = this.state as State;
    const { name, placeholder, treeData } = this.props;
    const selectBoxStyle = Object.assign(
      { width },
      styles.selectBox,
      showSelectBox ? styles.showSelectBox : {},
    );

    return (
      <Control
        id="tree-select-box"
        tabIndex="0"
        onBlur={this.handleBlur}
        name={name}
        style={styles.box}
        className="select"
      >
        <div
          onClick={() => this.setState({ showSelectBox: !showSelectBox })}
          className="select-control"
        >
          <span className="select-multi-value-wrapper">
            {showTips ? (
              <div className="select-placeholder">{placeholder}</div>
            ) : (
              <div className="select-value">
                <span className="select-value-label">
                  {(selectValue as DeptInfo).departmentName}
                </span>
              </div>
            )}
          </span>
          <span className="select-arrow-zone">
            <span className="select-arrow">
              {!!selectValue && (
                <Icon
                  onClick={() => this.handleClear}
                  changeable
                  clickable
                  name="close"
                  type="dark"
                  size="small"
                />
              )}
            </span>
          </span>
        </div>
        <div style={selectBoxStyle}>
          <Tree onSelect={this.handleSelect} treeData={treeData} />
        </div>
      </Control>
    );
  }
}

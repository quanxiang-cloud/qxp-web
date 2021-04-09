import CodeEditor from './CodeEditor';
import AttrForm from './AttrForm';

export default {
  AttrForm,
  component: CodeEditor,
  config: {
    title: '代码编辑器',
    icon: 'terminal',
    key: 'CodeEditor',
    category: 'advance',
    order: 1,
    defaultProps: {
      lineNumbers: true,
      theme: 'darcula',
      height: 300,
      language: 'shell',
    },
  },
};

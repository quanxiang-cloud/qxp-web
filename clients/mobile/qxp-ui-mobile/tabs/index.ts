import Tabs from './tabs';
import TabPane from './tab-pane';
import './tabs.scss';

const TabsNamespace = Object.assign(Tabs, { TabPane });

export default TabsNamespace;

export type {
  TabsProps,
  TabPaneProps,
  TabsTitleProps,
  TabsInstance,
  TabsClickTabEventParams,
  TabsContentProps,
} from './types';

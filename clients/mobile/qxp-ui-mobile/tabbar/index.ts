import Tabbar from './tabbar';
import TabbarItem from './tabbar-item';
import './tabbar.scss';

const TabbarNamespace = Object.assign(Tabbar, { Item: TabbarItem });

export default TabbarNamespace;
export { TabbarNamespace as Tabbar, TabbarItem };
export type { TabbarProps, TabbarItemProps } from './types';

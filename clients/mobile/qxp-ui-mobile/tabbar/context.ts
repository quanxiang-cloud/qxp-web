import { createContext, Context } from 'react';
import { TabbarProps } from './types';

export interface TabbarState {
    parent?: TabbarProps;
}

const TabbarContext: Context<TabbarState> = createContext({});

export default TabbarContext;

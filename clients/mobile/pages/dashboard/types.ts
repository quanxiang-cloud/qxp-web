import { FC, Key } from 'react';

export interface HomePageProps {
    key?: Key,
    active?: boolean
}

export interface HomeItem {
    title: string,
    icon: string,
    component: FC<HomePageProps>
}

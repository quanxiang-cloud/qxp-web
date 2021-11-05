import { createContext } from 'react';
import ParamsStore from './store';

export default createContext<ParamsStore>(new ParamsStore());

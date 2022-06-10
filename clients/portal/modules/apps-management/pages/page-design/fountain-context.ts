import React from 'react';
import { FountainPackage } from './blocks/fountainhead/type';

interface FountainCTX {
  fountainPackages: FountainPackage[];
}

const FountainContext = React.createContext<FountainCTX>({ fountainPackages: [] });

export default FountainContext;

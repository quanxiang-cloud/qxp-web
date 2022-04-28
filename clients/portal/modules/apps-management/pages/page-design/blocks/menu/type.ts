import { ReactComp } from '@pageDesign/types';

export * from '@pageDesign/types';

export type ReactComponent = ReactComp;

export interface Package {
  label: string;
  name: string;
  version: string;
  categories?: string[];
  hide?: boolean;
}

export interface InitialProps {
  [key: string]: any;
}

interface BaseVariantIcon {
  initialProps?: InitialProps;
}

export interface VariantImageIcon extends BaseVariantIcon {
  type: 'image';
  src: string;
}
export interface VariantPlatFormIcon extends BaseVariantIcon {
  type: 'platform';
  name: string;
}

export type VariantIcon = VariantImageIcon | VariantPlatFormIcon;

export interface Variant {
  icon: VariantIcon;
  desc?: string;
  label: string;
  initialProps?: InitialProps;
}

export interface BasePackageComponent {
  package: Package;
  name: string;
}

export interface PackageComponent extends Omit<Variant, 'icon'>, BasePackageComponent {
  Icon: ReactComponent;
  category?: string;
}

export interface CategoryVariants extends Pick<PackageComponent, 'category'> {
  variants: Variant[];
}

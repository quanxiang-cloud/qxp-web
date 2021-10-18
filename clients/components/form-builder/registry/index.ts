import { Dictionary, groupBy, orderBy } from 'lodash';

import elements, { Elements } from './elements';

type ElementConfig = Omit<FormBuilder.SourceElement<any>, 'displayOrder'>;

const AVAILABLE_CATEGORIES: Array<{ title: string; key: FormBuilder.ElementCategory }> = [
  { title: '基础字段', key: 'basic' },
  { title: '高级字段', key: 'advance' },
  { title: '布局字段', key: 'layout' },
];

class Registry {
  elements: Elements;
  components: { [key: string]: React.JSXElementConstructor<any>; } = {};
  placeholderComponents: { [key: string]: React.JSXElementConstructor<any>; } = {};
  layoutComponents: { [key: string]: React.JSXElementConstructor<any>; } = {};
  categories: Array<{ title: string; key: FormBuilder.ElementCategory }>;
  categorizedElements: Dictionary<FormBuilder.SourceElement<any>[]>;

  constructor() {
    this.elements = elements;
    this.categories = AVAILABLE_CATEGORIES;
    const orderFormItems = orderBy(this.elements, ['displayOrder']);
    this.categorizedElements = groupBy(orderFormItems, (item) => {
      return item.category;
    });

    this.getComponents();
  }

  private formatRegistry(element: ElementConfig): ElementConfig {
    const { placeholderComponent, component } = element;

    if (!placeholderComponent) {
      return { ...element, placeholderComponent: component };
    }
    return element;
  }

  // register external forms
  merge(formData: typeof elements): void {
    Object.assign(this.elements, formData);
  }

  getComponents(): void {
    Object.keys(this.elements).forEach((componentName: string) => {
      const {
        component,
        placeholderComponent,
      } = this.formatRegistry(this.elements[componentName]);

      if (placeholderComponent) this.placeholderComponents[componentName] = placeholderComponent;
      this.components[componentName] = component;
    });
  }
}

export { Registry };

export default new Registry();

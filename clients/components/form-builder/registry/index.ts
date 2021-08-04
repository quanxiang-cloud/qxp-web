import { Dictionary, groupBy, orderBy } from 'lodash';
import elements, { Elements } from './elements';

const AVAILABLE_CATEGORIES: Array<{ title: string; key: FormBuilder.ElementCategory }> = [
  { title: '基础字段', key: 'basic' },
  { title: '高级字段', key: 'advance' },
  { title: '布局字段', key: 'layout' },
];

class Registry {
  elements: Elements;
  components: { [key: string]: React.JSXElementConstructor<any>; } = {};
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

  // register external forms
  merge(formData: typeof elements) {
    Object.assign(this.elements, formData);
  }

  getComponents() {
    Object.keys(this.elements).forEach((componentName: string) => {
      const { component, isLayoutComponent, editComponent } = this.elements[componentName];
      this.components[componentName] = component;

      if (isLayoutComponent) {
        this.layoutComponents[componentName] = editComponent as React.JSXElementConstructor<any>;
      }
    });
  }
}

export { Registry };

export default new Registry();

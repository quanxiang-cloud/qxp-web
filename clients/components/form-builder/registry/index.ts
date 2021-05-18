import { DatePicker } from '@formily/antd-components';
import { Dictionary, groupBy, orderBy } from 'lodash';
import elements, { Elements } from './elements';

const AVAILABLE_CATEGORIES: Array<{ title: string; key: ElementCategory }> = [
  { title: '基础字段', key: 'basic' },
  // { title: '高级字段', key: 'advance' },
  // { title: '布局字段', key: 'layout' },
];

class Registry {
  elements: Elements;
  components: { [key: string]: React.JSXElementConstructor<any>; } = {};
  categories: Array<{ title: string; key: ElementCategory }>;
  categorizedElements: Dictionary<SourceElement<any>[]>;

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
      const { component } = this.elements[componentName];
      this.components[componentName] = component;
    });

    // todo fix this
    this.components.YearPicker = DatePicker.YearPicker;
    this.components.MonthPicker = DatePicker.MonthPicker;
  }
}

export { Registry };

export default new Registry();

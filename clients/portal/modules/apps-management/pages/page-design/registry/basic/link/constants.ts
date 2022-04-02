import { FunctionalProperty } from '@one-for-all/schema-spec';

export const INNER_LINK_FUNC_SPEC: FunctionalProperty = {
  type: 'functional_property',
  func: {
    type: 'raw',
    args: 'e',
    body: `
      e.stopPropagation();
      e.preventDefault();
      if (!e.currentTarget.href) {
        return;
      }
      this.history.replace(e.currentTarget.href);
    `,
  },
};

import { query } from '@lib/atom';

export default class Page {
  pageErrorElement: HTMLSpanElement;

  constructor() {
    this.pageErrorElement = query<HTMLSpanElement>('span.error');
    this.renderError();
  }

  renderError() {
    const msg = this.pageErrorElement?.textContent?.trim();
    if (msg) {
      this.pageErrorElement.classList.remove('hidden');
      setTimeout(() => {
        this.pageErrorElement.classList.add('hidden');
      }, 1000);
    }
  }
}

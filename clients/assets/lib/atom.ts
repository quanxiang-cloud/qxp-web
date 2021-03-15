/**
 * 输入框的属性
 */
export interface IInputField {
  name: string;
  inputElement: HTMLInputElement;
  onValidate?: () => boolean;
  value?: string | boolean;
  errMessage?: string;
  errorElement?: HTMLElement;
  isCheckbox?: boolean;
  actionElement?: HTMLButtonElement;
  url?: string;
}

export function query<T>(selector: string): T {
  return (document.querySelector(selector) as unknown) as T;
}

export const isMobile = (s: string) => /^1[3456789]\d{9}$/.test(s);

export const isEmail = (s: string) =>
  /^[A-Za-z0-9-_\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(s);

/**
 * 输入框 base
 */
export abstract class InputField implements IInputField {
  name: string;
  inputElement: HTMLInputElement;
  value?: string | boolean;
  errMessage?: string;
  errorElement?: HTMLElement;
  action: HTMLButtonElement;
  isCheckbox: boolean;
  onValidateAll?: Function;

  constructor(
    { name, value = '', errMessage = '', inputElement, errorElement }: IInputField,
    action: HTMLButtonElement,
    onValidateAll?: Function,
  ) {
    this.name = name;
    this.inputElement = inputElement;
    this.onValidateAll = onValidateAll || function () {};
    this.value = value;
    this.errMessage = errMessage;
    this.errorElement = errorElement;
    this.action = action;
    this.isCheckbox = this.inputElement.type === 'checkbox';
    this.getValue();
    this.baseBindEvents();
  }

  getValue() {
    const value = localStorage.getItem(this.name);
    if (value || value === '') {
      this.value = this.isCheckbox ? !!value : value;
      if (this.isCheckbox) {
        this.inputElement.checked = this.value as boolean;
      } else {
        this.inputElement.value = this.value as string;
      }
    }
    this.validate(true);
  }

  baseBindEvents() {
    this.inputElement.onblur = () => this.validate(true);
    this.inputElement.onchange = (e: Event) => {
      if (this.isCheckbox) {
        this.value = (e.target as HTMLInputElement).checked;
      } else {
        this.value = (e.target as HTMLInputElement).value;
      }
      localStorage.setItem(this.name, String(this.value));
    };
  }

  on(name: string, callback: EventListenerOrEventListenerObject) {
    this.inputElement.addEventListener(name, callback);
  }

  abstract validate(checkAll?: boolean): boolean;
}

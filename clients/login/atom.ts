/**
 * 输入框的属性
 */
export interface IInputField {
  name?: string;
  inputElement: HTMLInputElement;
  onValidate?: () => boolean;
  value?: string | boolean;
  errMessage?: string;
  errorElement?: HTMLElement;
  isCheckbox?: boolean;
  actionElement?: HTMLButtonElement;
  url?: string;
  asyncValidate?: boolean;
  customeValidator?: (value: string) => string;
}

export function query<T>(selector: string): T {
  return (document.querySelector(selector) as unknown) as T;
}

export const isMobile = (s: string) => /^1[3456789]\d{9}$/.test(s);

export const isEmail = (s: string) =>
  /^[A-Za-z0-9-_\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(s);

export type OnValidateAll = (
  context: any, isValid: boolean
) => boolean | (boolean | Promise<boolean>)[];
/**
 * 输入框 base
 */
export abstract class InputField implements IInputField {
  name?: string;
  inputElement: HTMLInputElement;
  value?: string | boolean;
  errMessage?: string;
  errorElement?: HTMLElement;
  action: HTMLButtonElement;
  isCheckbox: boolean;
  onValidateAll: OnValidateAll = () => true;
  asyncValidate?: boolean = false;
  customeValidator?: (value: string) => string;

  constructor(
    {
      name,
      value = '',
      errMessage = '',
      inputElement,
      errorElement,
      asyncValidate,
      customeValidator,
    }: IInputField,
    action: HTMLButtonElement,
    onValidateAll?: OnValidateAll,
  ) {
    this.name = name;
    this.inputElement = inputElement;
    this.onValidateAll = onValidateAll || (() => true);
    this.value = value;
    this.errMessage = errMessage;
    this.errorElement = errorElement;
    this.action = action;
    this.isCheckbox = this.inputElement.type === 'checkbox';
    this.asyncValidate = asyncValidate;
    this.customeValidator = customeValidator;
    this.getValue();
    this.baseBindEvents();
  }

  getValue() {
    let value;
    if (this.name) {
      value = localStorage.getItem(this.name);
    }
    if (value || value === '') {
      this.value = this.isCheckbox ? !!value : value;
      if (this.isCheckbox) {
        this.inputElement.checked = this.value as boolean;
      } else {
        this.inputElement.value = this.value as string;
      }
    }
    // this.validate(true);
  }

  baseBindEvents() {
    this.inputElement.onblur = () => this.validate(true);
    this.inputElement.onchange = (e: Event) => {
      if (this.isCheckbox) {
        this.value = (e.target as HTMLInputElement).checked;
      } else {
        this.value = (e.target as HTMLInputElement).value;
      }
      if (!this.name) {
        return;
      }
      localStorage.setItem(this.name, String(this.value));
    };
  }

  on(name: string, callback: EventListenerOrEventListenerObject) {
    this.inputElement.addEventListener(name, callback);
  }

  abstract validate(checkAll?: boolean): boolean | Promise<boolean>;
}

export function parseValidateAllResult(
  onValidateAllResult: (boolean | Promise<boolean>)[],
  errorElement?: HTMLElement,
): Promise<boolean> {
  return new Promise((resolve) => {
    let counter = 0;
    let allValid = true;
    for (let i = 0; i < onValidateAllResult.length; i += 1) {
      const otherInputIsValid = onValidateAllResult[i];
      if (typeof otherInputIsValid === 'boolean') {
        counter += 1;
        if (!otherInputIsValid) {
          allValid = false;
        }
        if (counter >= onValidateAllResult.length) {
          resolve(allValid);
        }
      } else if (otherInputIsValid instanceof Promise) {
        otherInputIsValid.
          then((valid) => {
            counter += 1;
            if (!valid) {
              allValid = false;
            }
            if (counter >= onValidateAllResult.length) {
              resolve(allValid);
            }
          }).catch((e) => {
            counter += 1;
            allValid = false;
            if (errorElement) {
              errorElement.textContent = e.message || e;
            }
            if (counter >= onValidateAllResult.length) {
              resolve(allValid);
            }
          });
      }
    }
  });
}

export function parseUserValidateResult(
  ...results: (boolean | Promise<boolean>)[]
): Promise<boolean> {
  return new Promise((resolve) => {
    let allValid = true;
    let counter = 0;
    const promises: Promise<boolean>[] = [];
    for (let i = 0; i < results.length; i += 1) {
      const result = results[i];
      if (result === false) {
        return resolve(false);
      }
      if (result instanceof Promise) {
        promises.push(result);
      }
    }
    for (let i = 0; i < promises.length; i += 1) {
      promises[i].then((isOk) => {
        counter += 1;
        if (!isOk) {
          allValid = false;
        }
        if (counter >= promises.length) {
          resolve(allValid);
        }
      }).catch(() => {
        counter += 1;
        allValid = false;
        if (counter >= promises.length) {
          resolve(allValid);
        }
      });
    }
    if (!promises.length) {
      resolve(allValid);
    }
  });
}

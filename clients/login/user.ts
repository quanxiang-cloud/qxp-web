import { IInputField } from '@assets/lib/atom'

import Remember from './remember'
import UserName from './username'

export interface IUser {
  username: IInputField;
  remember: IInputField;
  action: HTMLButtonElement;
}

export default abstract class User {
  protected username: UserName
  protected action: HTMLButtonElement

  constructor({ username, remember, action }: IUser) {
    new Remember(remember, action)
    this.username = new UserName(username, action, this.onValidateAll.bind(this))
    this.action = action
    this.bindEvents()
  }

  bindEvents() {
    this.action.onclick = this.login.bind(this)
  }

  login(e: Event): void {
    if (!this.validate()) {
      e.preventDefault();
    }
  }

  abstract onValidateAll(...args: unknown[]): boolean

  abstract validate(): boolean
}

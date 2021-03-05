import { IInputField, InputField, query } from '@assets/lib/atom'
import { httpPost } from '@assets/lib/f'
import { IResponse } from 'clients/@types/interface/api'
import UserName from './username'

export default class Captcha extends InputField {
  sender?: HTMLButtonElement
  username?: UserName
  url!: string
  errorId?: number

  constructor(captcha: IInputField, action: HTMLButtonElement, onValidateAll?: Function) {
    super(captcha, action, onValidateAll)
    if (!captcha.actionElement) {
      return
    }
    this.url = captcha.url || ''
    this.sender = captcha.actionElement
    this.bindEvents()
  }

  setUserName(username: UserName) {
    this.username = username
    if (!this.sender) {
      return
    }
    const syncUsername = () => {
      const element = this.sender as HTMLButtonElement
      if (this.username?.validate()) {
        element.classList.remove('disabled')
      } else {
        element.classList.add('disabled')
      }
    }
    syncUsername()
    this.username.on('change', syncUsername)
  }

  bindEvents() {
    if (!this.sender) {
      return
    }
    this.sender.onclick = this.sendCode.bind(this)
  }

  callSendApi() {
    return httpPost(this.url, JSON.stringify({ userName: this.username?.value }))
  }

  showError(errorMessage?: string) {
    if (this.errorId) {
      clearTimeout(this.errorId)
    }
    const pageErrorElement = query<HTMLSpanElement>('span.error')
    if (errorMessage && pageErrorElement) {
      pageErrorElement.innerText = errorMessage
      pageErrorElement.classList.remove('hidden')
      this.errorId = setTimeout(() => {
        pageErrorElement.classList.add('hidden')
      }, 3000)
    }
  }

  sendCode(e: Event) {
    e.preventDefault()
    if (!this.username?.validate()) {
      return
    }
    let counter = 60
    let tid = 0
    const element = this.sender as HTMLButtonElement

    const resetVars = (errorMessage?: string) => {
      this.showError(errorMessage)
      clearInterval(tid)
      element.classList.remove('disabled')
      counter = 60
      element.innerText = '获取验证码'
    }

    this.callSendApi()
      .then((resp: unknown) => {
        const res = resp as IResponse<string>
        if (res.code !== 0) {
          this.showError(res.msg)
        }
      })
      .catch(resetVars)
    element.classList.add('disabled')
    tid = setInterval(() => {
      counter--
      element.innerText = `${counter}`
      if (counter <= 0) {
        resetVars()
      }
    }, 1000)
  }

  validate(checkAll?: boolean) {
    let isValid = true
    if ((this.value as string).length < 6) {
      if (this.value !== '') {
        this.errMessage = '验证码至少为6位'
        isValid = false
      }
      this.action.classList.add('disabled')
    }
    if (isValid) {
      this.errMessage = ''
    }
    if (this.value === '') {
      isValid = false
    }
    ;(this.errorElement as HTMLElement).textContent = this.errMessage as string
    if (checkAll && (this.onValidateAll as Function)(this, isValid)) {
      this.action.classList.remove('disabled')
    }
    return isValid
  }
}

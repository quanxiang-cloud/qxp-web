export default class Notify {
  private duration?: number;
  private element: HTMLElement;
  private elements: Element[];

  constructor(ele: HTMLElement, duration = 3000) {
    this.duration = duration;
    this.element = ele;
    this.element.style.position = 'relative';
    this.elements = [];
    const style = document.createElement('style');
    style.innerHTML = `
      .notify {
        position: absolute;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        box-shadow: 0px 8px 24px 4px rgba(148, 163, 184, 0.25);
        border-radius: 4px 12px 12px 12px;
        transition: all .3s ease;
        animation: show 1s ease forwards;
      }

      @keyframes show {
        0% {
          transform: rotateX(90deg) translateX(-50%);
        }
        100% {
          transform: rotateX(0deg) translateX(-50%);
        }
      }
      
      .notify .message {
        font-size: 14px;
        line-height: 22px;
        margin-right: 64px;
      }

      .notify .close {
        cursor: pointer;
        color: #64748B;
        font-size: 20px;
        display: flex;
        align-items: center;
      }

      .notify.error {
        background: #FEF2F2;
        border: 1px solid #DC2626;
      }

      .notify.info {
        background: #F0FDF4;;
        border: 1px solid #16A34A;
      }
    `;
    document.head.appendChild(style);
    window.closeNotify = this.close;
  }

  public close = (e: Event | HTMLElement) => {
    let curNotifyElement: HTMLElement;
    if (e instanceof Event) {
      const closeElement = e.target as HTMLElement;
      curNotifyElement = closeElement.parentElement as HTMLElement;
    } else if (e instanceof HTMLElement) {
      curNotifyElement = e;
    } else {
      curNotifyElement = this.elements[0] as HTMLElement;
    }
    const curNotifyElementIndex = this.elements.findIndex(
      (element) => element === curNotifyElement
    );

    const elements = this.elements.slice(curNotifyElementIndex + 1) as HTMLElement[];
    this.elements.splice(curNotifyElementIndex, 1);
    curNotifyElement.parentElement?.removeChild(curNotifyElement);

    elements.forEach((element) => {
      const top = parseInt(element.style.top);
      if (top - 60 >= 80) {
        element.style.top = `${top - 60}px`;
      }
    });
  }

  private getTemplate(type: string, message: string) {
    return `
      <div class="notify ${type}">
        <span class="message">${message}</span>
        <span class="close" onClick="closeNotify(event);">x</span>
      </div>
    `;
  }

  private notify(type: string, message: string) {
    this.element.insertAdjacentHTML('beforeend', this.getTemplate(type, message));
    const element = this.element.lastElementChild as HTMLElement;
    if (element && this.elements.length) {
      element.style.top = `${(this.elements.length * 60) + 80}px`;
    }
    element && this.elements.push(element);
    setTimeout(() => this.close(element), this.duration);
  }

  info(message: string) {
    this.notify('info', message);
  }

  error(message: string) {
    this.notify('error', message);
  }
}

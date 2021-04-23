interface Options {
  duration?: number;
}

class Notify {
  private duration?: number;
  private element: HTMLElement;
  private notifyInstances: Element[];

  constructor() {
    this.duration = 3000;
    this.element = document.body;
    this.element.style.position = 'relative';
    this.notifyInstances = [];
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
        padding: 7px 16px;
        box-shadow: 0px 8px 24px 4px rgba(148, 163, 184, 0.25);
        border-radius: 4px 12px 12px 12px;
        transition: all .3s ease;
        animation: show 1s ease forwards;
        z-index: 40;
      }

      @keyframes show {
        0% {
          transform: rotateX(90deg) translateX(-50%);
        }
        100% {
          transform: rotateX(0deg) translateX(-50%);
        }
      }

      .notify .message-info {
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
      curNotifyElement = this.notifyInstances[0] as HTMLElement;
    }
    const curNotifyElementIndex = this.notifyInstances.findIndex(
      (element) => element === curNotifyElement
    );

    const notifyInstances = this.notifyInstances.slice(curNotifyElementIndex + 1) as HTMLElement[];
    this.notifyInstances.splice(curNotifyElementIndex, 1);
    curNotifyElement.parentElement?.removeChild(curNotifyElement);

    notifyInstances.forEach((element) => {
      const top = parseInt(element.style.top);
      if (top - 60 >= 80) {
        element.style.top = `${top - 60}px`;
      }
    });
  }

  private getTemplate(type: string, message: string) {
    return `
      <div class="notify ${type}">
        <span class="message-info">${message}</span>
        <span class="close" onClick="closeNotify(event);">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="currentColor"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg> 
        </span>
      </div>
    `;
  }

  private notify(type: string, message: string, options?: Options) {
    this.element.insertAdjacentHTML('beforeend', this.getTemplate(type, message));
    const element = this.element.lastElementChild as HTMLElement;
    if (!element) {
      return;
    }
    if (this.notifyInstances.length) {
      element.style.top = `${(this.notifyInstances.length * 60) + 80}px`;
    }
    this.notifyInstances.push(element);
    if (options?.duration === -1) {
      return;
    }
    setTimeout(() => this.close(element), options?.duration || this.duration);
  }

  public success(message: string, options?: Options) {
    this.notify('info', message, options);
  }

  public error(message: string, options?: Options) {
    this.notify('error', message, options);
  }

  setDuration(duration: number) {
    this.duration = duration;
  }

  setRoot(element: HTMLElement) {
    this.element = element;
  }
}

export default new Notify();

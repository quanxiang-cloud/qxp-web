import React, { Component } from 'react';

type AuthorityType = string | string[] | (() => string | string[]);

export interface IAuthorized {
  authority: AuthorityType;
  noMatch: JSX.Element;
}

class Authorized extends Component<IAuthorized, { currentAuthority: string | string[] }> {
  static setAuthority(str: string | string[]): void {
    const authString = typeof str == 'string' ? [str] : str;
    localStorage.setItem('authority', JSON.stringify(authString));
    Authorized.instances.forEach((instance) => instance.reloadAuthorized());
  }

  constructor(props: IAuthorized) {
    super(props);
    this.state = {
      currentAuthority: this.getAuthority(),
    };
    Authorized.instances.push(this);
  }

  componentWillUnmount() {
    Authorized.instances = Authorized.instances.filter((item) => item !== this);
  }

  static instances: Authorized[] = [];

  getAuthority(str?: string): string | string[] {
    const authString =
      typeof str === 'undefined' && localStorage ? localStorage.getItem('authority') : str;
    let authority;
    try {
      if (authString) {
        authority = JSON.parse(authString);
      }
    } catch {
      authority = authString;
    }
    if (typeof authority === 'string') {
      authority = [authority];
    }
    if (!authority) {
      authority = [];
    }
    return authority;
  }

  reloadAuthorized() {
    this.setState((s) => ({ ...s, currentAuthority: this.getAuthority() }));
  }

  checkPermissions(
    authority: AuthorityType,
    target: React.ReactNode,
    Exception: JSX.Element | null,
  ) {
    const { currentAuthority } = this.state;
    const isArray = (s: unknown) => Array.isArray(s);
    if (!authority) {
      return target;
    }
    if (isArray(authority)) {
      if (isArray(currentAuthority)) {
        if ((currentAuthority as string[]).some((item) => (authority as string[]).includes(item))) {
          return target;
        }
      } else if ((authority as string[]).includes(currentAuthority as string)) {
        return target;
      }
      return Exception;
    }
  }

  render() {
    const { authority, children, noMatch = null } = this.props;
    return <>{this.checkPermissions(authority, children, noMatch)}</>;
  }
}

export default Authorized;

import React from 'react';

type Props = {
  name: string;
  link: string;
}

export default function ExternalViewRender({ name, link }: Props): JSX.Element {
  const appID = window.location.pathname.split('/')[2];
  function realizeLink(link: string): string {
    const replacements: Record<string, string> = {
      user_id: window.USER.id,
      user_name: window.USER.name,
      user_email: window.USER.email,
      user_phone: window.USER.phone,
      dep_id: window.USER.deps[0][0].id,
      dep_name: window.USER.deps[0][0].name,
      appid: appID,
    };

    let _link = link;
    Object.keys(replacements).forEach((key) => {
      _link = _link.replace(new RegExp('\\$\\{' + key + '\\}', 'g'), replacements?.[key]);
    });
    return _link;
  }

  return (
    <div className="w-full h-full">
      <iframe
        className="w-full h-full"
        src={realizeLink(link)}
        style={{ border: 'none' }}
      />
    </div>
  );
}

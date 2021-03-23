const svgSprites = `<svg width="0" height="0" class="hidden">
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="add_task">
    <path fill="currentColor" d="M22 5.18L10.59 16.6l-4.24-4.24 1.41-1.41 2.83 2.83 10-10L22 5.18zM12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8c1.57 0 3.04.46 4.28 1.25l1.45-1.45A10.02 10.02 0 0012 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.73 0 3.36-.44 4.78-1.22l-1.5-1.5c-1 .46-2.11.72-3.28.72zm7-5h-3v2h3v3h2v-3h3v-2h-3v-3h-2v3z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="add">
    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="arrow_drop_down">
    <path fill="currentColor" d="M7 10l5 5 5-5H7z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="arrow_drop_up">
    <path fill="currentColor" d="M7 14l5-5 5 5H7z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="book">
    <path fill="currentColor" d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 4h2v5l-1-.75L9 9V4zm9 16H6V4h1v9l3-2.25L13 13V4h5v16z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="category">
    <path fill="currentColor" d="M12 2l-5.5 9h11L12 2zM17.5 22a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM3 13.5h8v8H3v-8z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 14" id="check">
    <path fill="currentColor" d="M5.59 10.58L1.42 6.41 0 7.82l5.59 5.59 12-12L16.18 0 5.59 10.58z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" id="close">
    <path fill="currentColor" d="M14 1.41L12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7 14 1.41z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="cloud_upload">
    <path fill="currentColor" d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95A5.469 5.469 0 0112 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11A2.98 2.98 0 0122 15c0 1.65-1.35 3-3 3zM8 13h2.55v3h2.9v-3H16l-4-4-4 4z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="copy">
    <path fill="currentColor" d="M15.79 3H5.684A1.69 1.69 0 004 4.684v11.79h1.684V4.684H15.79V3zm2.526 3.368H9.053a1.69 1.69 0 00-1.685 1.685v11.79a1.69 1.69 0 001.685 1.683h9.263A1.69 1.69 0 0020 19.842V8.052a1.69 1.69 0 00-1.684-1.684zm0 13.474H9.053V8.052h9.263v11.79z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="create_new_folder">
    <path fill="currentColor" d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm0 12H4V6h5.17l2 2H20v10zm-8-4h2v2h2v-2h2v-2h-2v-2h-2v2h-2v2z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="device_hub">
    <path fill="currentColor" d="M17 16l-4-4V8.82C14.16 8.4 15 7.3 15 6c0-1.66-1.34-3-3-3S9 4.34 9 6c0 1.3.84 2.4 2 2.82V12l-4 4H3v5h5v-3.05l4-4.2 4 4.2V21h5v-5h-4z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="drag_handle">
    <path fill="currentColor" d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="edit">
    <path fill="currentColor" d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06zM17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83a.996.996 0 000-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="exit_to_app">
    <path fill="currentColor" d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5a2 2 0 00-2 2v4h2V5h14v14H5v-4H3v4a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="info">
    <path fill="currentColor" d="M11 7h2v2h-2V7zm0 4h2v6h-2v-6zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="keyboard_arrow_down">
    <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="link_off">
    <path fill="currentColor" d="M14.39 11L16 12.61V11h-1.61zM17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.27-.77 2.37-1.87 2.84l1.4 1.4A4.986 4.986 0 0022 12c0-2.76-2.24-5-5-5zM2 4.27l3.11 3.11A4.991 4.991 0 002 12c0 2.76 2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.59 1.21-2.9 2.76-3.07L8.73 11H8v2h2.73L13 15.27V17h1.73l4.01 4.01 1.41-1.41L3.41 2.86 2 4.27z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="link">
    <path fill="currentColor" d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8v-2z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="list_alt">
    <path fill="currentColor" d="M19 5v14H5V5h14zm1.1-2H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM11 7h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6v-2zM7 7h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="login">
    <path fill="currentColor" d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="logout">
    <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="menu">
    <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="message">
    <path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="more_horiz">
    <path fill="currentColor" d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="next">
    <path fill="currentColor" fill-rule="evenodd" d="M16.501 7L22 12.499 16.5 17.998V7zM2 11.499h14.5v2H2v-2z" clip-rule="evenodd"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="password">
    <path fill="currentColor" fill-rule="evenodd" d="M10.008 10.538l5.356-5.356h2.546v2.546l-1.186 1.185-.052-.01a2.467 2.467 0 00-2.868 2.93l-1.25 1.25a4.5 4.5 0 11-2.546-2.545zm-.498 3.044a1.62 1.62 0 10-2.292 2.291 1.62 1.62 0 002.291-2.29z" clip-rule="evenodd"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="pause_circle_outline">
    <path fill="currentColor" d="M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="play_circle_outline">
    <path fill="currentColor" d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="playlist_add_check">
    <path fill="currentColor" d="M14 10H2v2h12v-2zm0-4H2v2h12V6zM2 16h8v-2H2v2zm19.5-4.5L23 13l-6.99 7-4.51-4.5L13 14l3.01 3 5.49-5.5z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="priority_high">
    <path fill="currentColor" d="M12 21a2 2 0 100-4 2 2 0 000 4zM10 3h4v12h-4V3z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="restore_from_trash">
    <path fill="currentColor" d="M15.5 4l-1-1h-5l-1 1H5v2h14V4h-3.5zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2-5V9h8v10H8v-5zm2 4h4v-4h2l-4-4-4 4h2v4z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="restore">
    <path fill="currentColor" d="M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="save">
    <path fill="currentColor" d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6V6z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="search">
    <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="settings">
    <path fill="currentColor" d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46a.5.5 0 00-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0014 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.566.566 0 00-.18-.03c-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46a.5.5 0 00.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73 0 .21-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7 1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2 1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21 1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74 0-.2.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21 1.27.51 1.04.42.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13 1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7 1.21-1.07.85-.89.7.14 1.13zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="sms_failed">
    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zm-9-4h2v2h-2v-2zm0-6h2v4h-2V6z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="toggle_off">
    <path fill="currentColor" d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zM7 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path>
  </symbol>
  <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="toggle_on">
    <path fill="currentColor" d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path>
  </symbol>
</svg>`;

export default svgSprites;

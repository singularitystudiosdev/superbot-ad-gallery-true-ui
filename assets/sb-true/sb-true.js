/* sb-true.js: markup builders for the real Superbot desktop surfaces (pairs with sb-true.css).
   Every builder returns an HTML string; wrap the result in an element with class "sbt".
   The ad owns timing; these own the look. See reference.html for every state. */
(() => {
  'use strict';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const svg = (inner, cls = 'sbt-ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${inner}</svg>`;

  // lucide paths (ISC), the icon set the app ships
  const ICON = {
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    minus: '<path d="M5 12h14"/>',
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    square_chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    hammer: '<path d="m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9"/><path d="m18 15 4-4"/><path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5"/>',
    code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>',
    up: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    stop: '<rect x="5" y="5" width="14" height="14" rx="3"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    filter: '<path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/>',
    panel: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98"/><path d="m15.41 6.51-6.82 3.98"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    gear: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    tasks: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
    bug: '<path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>',
    map: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    app: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
    terminal: '<path d="m4 17 6-6-6-6"/><path d="M12 19h8"/>',
    fetch: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  };
  const icon = (name) => svg(ICON[name] || '');

  // the cat mark (hub/brand mark paths); glitch = the idle mark's teal/magenta offset copies
  let uid = 0;
  function cat({ glitch = false, ink = '#ffffff', cls = 'sbt-cat', eyes = '#000' } = {}) {
    const id = `sbt-face-${++uid}`;
    const mask = `<mask id="${id}" maskUnits="userSpaceOnUse" x="-30" y="-30" width="160" height="160"><g fill="#fff"><path d="M29 32H71A15 15 0 0 1 86 47V71A15 15 0 0 1 71 86H29A15 15 0 0 1 14 71V47A15 15 0 0 1 29 32Z"/><path d="M14 46V28Q14 20 21 21Q28 24 36 32Z"/><path d="M86 46V28Q86 20 79 21Q72 24 64 32Z"/></g><g fill="#000"><ellipse cx="35" cy="58" rx="8" ry="11"/><ellipse cx="65" cy="58" rx="8" ry="11"/></g></mask>`;
    const layers = glitch
      ? `<rect x="-30" y="-30" width="160" height="160" fill="#00e5c3" mask="url(#${id})" transform="translate(-1.6 -1.6)"/><rect x="-30" y="-30" width="160" height="160" fill="#c026d3" mask="url(#${id})" transform="translate(1.6 1.6)"/>`
      : '';
    const eyeFill = eyes && eyes !== '#000' ? `<ellipse cx="35" cy="58" rx="8" ry="11" fill="${eyes}"/><ellipse cx="65" cy="58" rx="8" ry="11" fill="${eyes}"/>` : '';
    return `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true"><defs>${mask}</defs>${layers}${eyeFill}<rect x="-30" y="-30" width="160" height="160" fill="${ink}" mask="url(#${id})"/></svg>`;
  }

  // ---------- composer ----------
  // state: 'idle' (placeholder, grey send) | 'typed' (text, gradient send) | 'busy' (turn running: stop, spinner)
  function composer({ state = 'idle', text = '', placeholder = 'How can superbot help you today?', focus = true, superOn = false, caret = false, meta = true, ctx = '142k of 200k', mode = 'chat' } = {}) {
    const empty = !text;
    const input = empty
      ? `<div class="sbt-input" data-empty>${esc(state === 'busy' ? 'Sent now, read when this turn ends' : placeholder)}</div>`
      : `<div class="sbt-input">${esc(text)}${caret ? '<i class="sbt-caret"></i>' : ''}</div>`;
    const send = state === 'busy'
      ? `<span class="sbt-send" data-busy>${icon('stop')}</span>`
      : `<span class="sbt-send"${!empty ? ' data-ready' : ''}>${icon('up')}</span>`;
    const bar = `<div class="sbt-bar"><span class="sbt-plus">${icon('plus')}</span>`
      + `<span class="sbt-mode"><span${mode === 'chat' ? ' data-on' : ''}>${icon('chat')}</span><span${mode === 'code' ? ' data-on' : ''}>${icon('hammer')}</span></span>`
      + (state === 'busy' ? '<span class="sbt-spin"></span>' : '')
      + `<span class="sbt-bar-grow"></span>`
      + `<span class="sbt-super"${superOn ? ' data-on' : ''}${state === 'busy' ? ' data-busy' : ''}>SUPER<i></i></span>`
      + `<span class="sbt-plat">${cat()}superbot${icon('down')}</span>`
      + `<span class="sbt-cu">${icon('monitor')}</span><span class="sbt-mic">${icon('mic')}</span>${send}</div>`;
    const box = `<div class="sbt-composer"${focus ? ' data-focus' : ''}>${input}${bar}</div>`;
    const metaLine = meta ? `<div class="sbt-meta"><span class="sbt-meta-ctx">${esc(ctx)}</span><span class="sbt-meta-bar"><i></i></span><span class="sbt-meta-cap">superbot is AI and can make mistakes.</span></div>` : '';
    return box + metaLine;
  }

  // ---------- thread pieces ----------
  const divider = (label = 'Today') => `<div class="sbt-divider">${esc(label)}</div>`;
  const user = (text) => `<div class="sbt-user">${esc(text)}</div>`;
  // html: trusted markup (the ad's own copy), so answers can carry <b>, <p>, a caret
  const bot = (html) => `<div class="sbt-bot">${html}</div>`;
  const step = ({ icon: ic = 'search', label, target = '', ms = '', status = 'done' }) =>
    `<li class="sbt-step" data-status="${status}">${icon(ic)}<span class="sbt-step-label">${esc(label)}${target ? ` <b>${esc(target)}</b>` : ''}</span>${ms ? `<span class="sbt-step-ms">${esc(ms)}</span>` : ''}</li>`;
  const steps = (list) => `<ol class="sbt-steps">${list.map(step).join('')}</ol>`;
  const idle = (line = 'Good afternoon. Where do we go?') => `<div class="sbt-idle">${cat({ glitch: true, cls: 'sbt-idle-mark' })}<div class="sbt-idle-line">${esc(line)}</div></div>`;

  // ---------- the window ----------
  // rail: [{ img, label, dot, badge }] vendor tiles after the superbot home tile
  // rows: [{ title, when, on, av: img url | icon name, running, live }]
  function shell({ title = 'New chat', rail = [], rows = [], feed = '', dock = '', feedBottom = true, email = 'hi@superbot.gg' } = {}) {
    const tiles = rail.map((t) => `<span class="sbt-rail-tile" title="${esc(t.label || '')}">${t.img ? `<img src="${esc(t.img)}" alt="">` : icon(t.icon || 'app')}${t.dot ? '<i class="sbt-rail-dot"></i>' : ''}${t.badge ? `<i class="sbt-rail-badge">${esc(t.badge)}</i>` : ''}</span>`).join('');
    const railHtml = `<nav class="sbt-rail"><span class="sbt-rail-tile sbt-rail-home" data-active>${cat({ eyes: '#6d5cff' })}</span><span class="sbt-rail-sep"></span>${tiles}<span class="sbt-rail-grow"></span><span class="sbt-rail-sep"></span>`
      + `<span class="sbt-rail-tile">${icon('tasks')}</span><span class="sbt-rail-tile">${icon('gear')}</span><span class="sbt-rail-tile">${icon('bug')}</span><span class="sbt-rail-sep"></span><span class="sbt-rail-tile">${icon('plus')}</span></nav>`;
    const rowHtml = rows.map((r) => {
      const av = r.av && /[./]/.test(r.av) ? `<img src="${esc(r.av)}" alt="">` : icon(r.av || 'square_chat');
      return `<div class="sbt-row"${r.on ? ' data-on' : ''}${r.running ? ' data-running' : ''}><span class="sbt-row-av">${av}</span><span class="sbt-row-title">${esc(r.title)}</span><span class="sbt-row-when"${r.live ? ' data-live' : ''}>${esc(r.when || '')}</span></div>`;
    }).join('');
    const side = `<aside class="sbt-side"><div class="sbt-brand">${cat({ cls: 'sbt-brand-mark' })}<span class="sbt-brand-name">superbot.gg</span><span class="sbt-sq">${icon('filter')}</span><span class="sbt-sq">${icon('search')}</span></div>`
      + `<div class="sbt-lane"><span data-on>${icon('square_chat')}Chat</span><span>${icon('code')}Code</span></div>`
      + `<div class="sbt-newchat">${cat({ ink: '#0d0d0d', eyes: '#e6e8ee' })}New chat</div>`
      + `<div class="sbt-earlier"><b>Earlier</b>${icon('minus')}${icon('plus')}</div><div class="sbt-rows">${rowHtml}</div>`
      + `<div class="sbt-acct"><div class="sbt-acct-top"><span class="sbt-acct-av">${esc(email[0].toUpperCase())}</span><span class="sbt-acct-who"><b>${esc(email)}</b><span>Resets in 4d</span></span><span class="sbt-acct-btn">${icon('plus')}</span><span class="sbt-acct-btn">${icon('gear')}</span></div>`
      + `<div class="sbt-acct-plan">${cat({ cls: 'sbt-plan-mark' })}<span>Superbot <em>Pro</em></span></div>`
      + `<div class="sbt-acct-meter"><span>84%</span><span class="sbt-acct-bar"><i></i></span><span class="sbt-upgrade">UPGRADE</span></div></div></aside>`;
    const top = `<header class="sbt-top"><span class="sbt-top-title">${esc(title)}</span><span class="sbt-search">${icon('search')}<span>Search</span><kbd>⌘K</kbd></span><span class="sbt-top-grow"></span><span class="sbt-top-btn">${icon('panel')}</span></header>`;
    const main = `<section class="sbt-main">${top}<div class="sbt-feed"${feedBottom ? ' data-bottom' : ''}>${feed}</div><div class="sbt-dock">${dock}</div></section>`;
    return `<div class="sbt-app">${railHtml}${side}${main}</div>`;
  }

  window.SBT = { esc, icon, cat, composer, divider, user, bot, step, steps, idle, shell, ICON };
})();

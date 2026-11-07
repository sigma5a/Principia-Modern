(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const body = document.body;
  const bar = document.createElement('nav');
  bar.className = 'modern-reader';
  bar.setAttribute('aria-label', 'Reader controls');
  bar.innerHTML = `
    <a class="reader-brand" href="../index.html" title="Back to the interactive companion"><span class="reader-mark">N</span><span class="reader-title">Principia / Full Edition</span></a>
    <span class="reader-spacer"></span>
    <input class="reader-search" type="search" placeholder="Find on this page…" aria-label="Find on this page">
    <a class="reader-button" href="read.html" title="All volumes">Volumes</a>
    <button class="reader-button" data-action="toc" title="Table of contents">Contents</button>
    <button class="reader-button font-control" data-action="smaller" title="Smaller text">A−</button>
    <button class="reader-button font-control" data-action="larger" title="Larger text">A+</button>
    <button class="reader-button" data-action="theme" title="Toggle night reading">◐</button>`;
  const progress = document.createElement('div');
  progress.className = 'reader-progress';
  const drawer = document.createElement('aside');
  drawer.className = 'reader-drawer';
  drawer.setAttribute('aria-label', 'Table of contents');
  drawer.innerHTML = '<h2>Complete contents</h2>';
  const seen = new Set();
  [...document.querySelectorAll('h2[id],h3[id]')].forEach(h => {
    const label = h.textContent.replace(/\s+/g, ' ').trim();
    if (!label || seen.has(label) || label.includes('PROJECT GUTENBERG')) return;
    seen.add(label);
    const a = document.createElement('a');
    a.href = `#${h.id}`;
    a.textContent = label;
    if (h.tagName === 'H3') a.className = 'sub';
    a.addEventListener('click', () => drawer.classList.remove('open'));
    drawer.appendChild(a);
  });
  const credit = document.createElement('div');
  credit.className = 'reader-credit';
  credit.innerHTML = '<strong>Complete illustrated edition.</strong> Isaac Newton, translated by Andrew Motte; first American edition revised by N. W. Chittenden (1846). Public-domain transcription and figures supplied by Project Gutenberg, eBook 76404.';
  const header = $('#pg-header');
  if (header) header.insertAdjacentElement('afterend', credit); else body.prepend(credit);
  body.prepend(drawer);
  body.prepend(progress);
  body.prepend(bar);

  let size = Number(localStorage.getItem('principiaReaderSize') || 19);
  const setSize = n => {
    size = Math.max(15, Math.min(25, n));
    document.documentElement.style.setProperty('--reader-size', `${size}px`);
    localStorage.setItem('principiaReaderSize', size);
  };
  setSize(size);
  if (localStorage.getItem('principiaReaderNight') === '1') body.classList.add('reader-night');
  bar.addEventListener('click', e => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'toc') drawer.classList.toggle('open');
    if (action === 'smaller') setSize(size - 1);
    if (action === 'larger') setSize(size + 1);
    if (action === 'theme') {
      body.classList.toggle('reader-night');
      localStorage.setItem('principiaReaderNight', body.classList.contains('reader-night') ? '1' : '0');
    }
  });
  $('.reader-search', bar).addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      window.find(e.currentTarget.value.trim(), false, e.shiftKey, true, false, true, false);
    }
  });
  addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
  }, {passive:true});
  addEventListener('keydown', e => { if (e.key === 'Escape') drawer.classList.remove('open'); });
})();

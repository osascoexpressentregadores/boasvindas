(function(){
  const sheets = Array.from(document.querySelectorAll('.sheet'));
  const thumbs = Array.from(document.querySelectorAll('.thumb'));
  const pageTitle = document.getElementById('pageTitle');
  const pageCounter = document.getElementById('pageCounter');
  const progressFill = document.getElementById('progressFill');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnPrevSmall = document.getElementById('btnPrevSmall');
  const btnNextSmall = document.getElementById('btnNextSmall');
  const btnFirst = document.getElementById('btnFirst');
  const btnStart = document.getElementById('btnStart');
  const introCard = document.getElementById('introCard');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const bookStage = document.getElementById('bookStage');
  let current = 0;

  function update(){
    sheets.forEach((sheet, index) => {
      sheet.classList.remove('active','prev','next');
      if(index === current) sheet.classList.add('active');
      if(index < current) sheet.classList.add('prev');
      if(index > current) sheet.classList.add('next');
    });
    thumbs.forEach((thumb, index) => thumb.classList.toggle('active', index === current));
    const active = sheets[current];
    pageTitle.textContent = active.dataset.title || 'Página';
    pageCounter.textContent = `Página ${current + 1} de ${sheets.length}`;
    progressFill.style.width = `${((current + 1) / sheets.length) * 100}%`;
    btnPrev.disabled = current === 0;
    btnPrevSmall.disabled = current === 0;
    btnNext.disabled = current === sheets.length - 1;
    btnNextSmall.disabled = current === sheets.length - 1;
    btnNextSmall.textContent = current === sheets.length - 1 ? 'Fim da leitura' : 'Próxima página';
  }
  function goTo(index){ current = Math.max(0, Math.min(index, sheets.length - 1)); update(); }
  function next(){ goTo(current + 1); }
  function prev(){ goTo(current - 1); }

  btnNext.addEventListener('click', next);
  btnNextSmall.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);
  btnPrevSmall.addEventListener('click', prev);
  btnFirst.addEventListener('click', () => { goTo(0); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  btnStart.addEventListener('click', () => { introCard.classList.add('is-hidden'); bookStage.scrollIntoView({ behavior:'smooth', block:'center' }); });
  thumbs.forEach(thumb => thumb.addEventListener('click', () => goTo(Number(thumb.dataset.go))));
  document.addEventListener('keydown', (event) => {
    if(event.key === 'ArrowRight' || event.key === ' ') next();
    if(event.key === 'ArrowLeft') prev();
    if(event.key === 'Home') goTo(0);
    if(event.key === 'End') goTo(sheets.length - 1);
  });

  let touchStartX = 0;
  let touchEndX = 0;
  bookStage.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive:true });
  bookStage.addEventListener('touchend', (event) => {
    touchEndX = event.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if(Math.abs(diff) > 45){ diff > 0 ? next() : prev(); }
  }, { passive:true });

  btnFullscreen.addEventListener('click', () => {
    const target = document.documentElement;
    if(!document.fullscreenElement){ target.requestFullscreen?.(); }
    else{ document.exitFullscreen?.(); }
  });

  update();
})();

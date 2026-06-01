(function(){
  const data = [
    ['01','Capa','assets/img/01_capa_boas_vindas_ao_parceiro_oe.png'],
    ['02','Você foi convocado','assets/img/02_voce_foi_convocado.png'],
    ['03','Que tipo de jogador você é','assets/img/03_que_tipo_de_jogador_voce_e.png'],
    ['04','O grupo é o rádio do time','assets/img/04_grupo_radio_do_time.png'],
    ['05','Chegou no cliente','assets/img/05_chegou_no_cliente.png'],
    ['06','A jogada certa da entrega','assets/img/06_jogada_certa_da_entrega.png'],
    ['07','O código é o gol validado','assets/img/07_codigo_gol_validado.png'],
    ['08','Antes de sair da loja','assets/img/08_antes_de_sair_da_loja.png'],
    ['09','Cliente não atende','assets/img/09_cliente_nao_atende.png'],
    ['10','Jogue junto até o apito final','assets/img/10_jogue_junto_ate_o_apito_final.png']
  ];
  const leftSlot = document.getElementById('leftSlot');
  const rightSlot = document.getElementById('rightSlot');
  const book = document.getElementById('book');
  const stickers = document.getElementById('stickers');
  const chapterLabel = document.getElementById('chapterLabel');
  const pageLabel = document.getElementById('pageLabel');
  const progressBar = document.getElementById('progressBar');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const finishBtn = document.getElementById('finishBtn');
  const finale = document.getElementById('finale');
  const restartBtn = document.getElementById('restartBtn');
  let index = 0;
  let lastAction = 'next';

  data.forEach((p,i)=>{
    const btn=document.createElement('button'); btn.className='sticker'; btn.type='button'; btn.dataset.go=i;
    btn.innerHTML=`<b>${p[0]}</b><img src="${p[2]}" alt="">`;
    btn.addEventListener('click',()=>go(i)); stickers.appendChild(btn);
  });

  function desktop(){ return matchMedia('(min-width:1051px)').matches; }
  function makePage(item, single){
    if(!item) return '<div class="page-slot blank" aria-hidden="true"></div>';
    const cls = single ? 'page-slot single' : 'page-slot';
    return `<div class="${cls}"><img src="${item[2]}" alt="${item[1]}"></div>`;
  }
  function pairStart(){
    if(index===0) return 0;
    if(index>=data.length-1) return data.length-1;
    return index % 2 === 0 ? index-1 : index;
  }
  function render(){
    const d=desktop(); const start=d?pairStart():index; const end=d && start>0 && start<data.length-1 ? Math.min(start+1,data.length-1) : start;
    leftSlot.className='page-slot left-slot'; rightSlot.className='page-slot right-slot';
    if(!d || start===0 || start===data.length-1){
      book.classList.add('single-mode');
      leftSlot.style.display='none'; rightSlot.classList.add('single'); rightSlot.innerHTML=`<img src="${data[start][2]}" alt="${data[start][1]}">`;
      index=start;
    }else{
      book.classList.remove('single-mode'); leftSlot.style.display='block'; rightSlot.classList.remove('single');
      leftSlot.innerHTML=`<img src="${data[start][2]}" alt="${data[start][1]}">`;
      rightSlot.innerHTML=`<img src="${data[end][2]}" alt="${data[end][1]}">`;
      index=start;
    }
    const title = start===end ? data[start][1] : `${data[start][1]} + ${data[end][1]}`;
    chapterLabel.textContent=title;
    pageLabel.textContent=start===end ? `${data[start][0]} / ${String(data.length).padStart(2,'0')}` : `${data[start][0]}–${data[end][0]} / ${String(data.length).padStart(2,'0')}`;
    progressBar.style.width=`${((end+1)/data.length)*100}%`;
    prevBtn.disabled=start===0; nextBtn.disabled=end===data.length-1;
    
    const atEnd = end===data.length-1;
    finishBtn.textContent = 'Leitura concluída';
    finishBtn.classList.toggle('is-hidden', !atEnd);
    finishBtn.classList.toggle('is-ready', atEnd);
    Array.from(stickers.children).forEach((s,i)=>s.classList.toggle('active',i>=start&&i<=end));
    try{ stickers.children[start].scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'}); }catch(e){}
  }
  function animate(){ const el = lastAction==='prev'?leftSlot:rightSlot; el.classList.remove('turning-next','turning-prev'); void el.offsetWidth; el.classList.add(lastAction==='prev'?'turning-prev':'turning-next'); }
  function go(i){ const max=data.length-1; lastAction=i<index?'prev':'next'; index=Math.max(0,Math.min(i,max)); render(); animate(); }
  function next(){ if(index>=data.length-1){openFinal();return;} go(desktop()?Math.min(pairStart()+2,data.length-1):index+1); }
  function prev(){ go(desktop()?Math.max(pairStart()-2,0):index-1); }
  
  function celebrate(){
    const old=document.querySelector('.finale-confetti');
    if(old) old.remove();
    const box=document.createElement('div');
    box.className='finale-confetti';
    const colors=['#ffd73f','#0aa34b','#e7192f','#ffffff','#062b69'];
    for(let i=0;i<44;i++){
      const c=document.createElement('i');
      c.style.left=(Math.random()*100)+'%';
      c.style.background=colors[i%colors.length];
      c.style.animationDelay=(Math.random()*.55)+'s';
      c.style.animationDuration=(1.15+Math.random()*1.15)+'s';
      c.style.transform='rotate('+Math.floor(Math.random()*180)+'deg)';
      box.appendChild(c);
    }
    document.body.appendChild(box);
    setTimeout(()=>box.remove(),2900);
  }
  function openFinal(){ finale.classList.add('open'); finale.setAttribute('aria-hidden','false'); celebrate(); }
  function closeFinal(){ finale.classList.remove('open'); finale.setAttribute('aria-hidden','true'); }
  prevBtn.addEventListener('click',prev); nextBtn.addEventListener('click',next);
  finishBtn.addEventListener('click',()=>{ if(index>=data.length-1) openFinal(); });
  restartBtn.addEventListener('click',()=>{closeFinal();go(0)});
  document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeFinal));
  addEventListener('keydown',e=>{ if(e.key==='ArrowRight'||e.key===' ') next(); if(e.key==='ArrowLeft') prev(); if(e.key==='Escape') closeFinal(); });
  let sx=0; book.addEventListener('touchstart',e=>sx=e.changedTouches[0].clientX,{passive:true}); book.addEventListener('touchend',e=>{const dx=sx-e.changedTouches[0].clientX;if(Math.abs(dx)>45)(dx>0?next:prev)();},{passive:true});
  addEventListener('resize',render); render();
})();

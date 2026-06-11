/* theme.js — tema claro/escuro/auto, compartilhado por todas as páginas.
   Carregado no <head> DEPOIS do <style> (lê --paper p/ o theme-color) e
   ANTES do <body> (aplica o tema cedo, sem flash).

   Modos: 'auto' (segue o sistema, padrão) · 'light' · 'dark', salvos em
   localStorage ('aguacafe.theme'). O CSS de cada página só precisa do bloco
   html[data-theme=dark]{...} com as overrides das vars — o claro é o :root.
   Botão opcional: um elemento com id="themebtn" vira o alternador. */
(function(){
  const KEY='aguacafe.theme';
  const MODES=['auto','light','dark'];
  const LABEL={auto:'🌗 auto', light:'☀ claro', dark:'🌙 escuro'};
  // fallback p/ ambientes sem matchMedia: 'auto' vira claro
  const mq=window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : {matches:false};

  function pref(){
    try{ const v=localStorage.getItem(KEY); return MODES.includes(v)?v:'auto'; }
    catch(_){ return 'auto'; }
  }
  function setPref(v){ try{ localStorage.setItem(KEY,v); }catch(_){} }

  function apply(forced){
    const p=pref();
    const eff=forced || (p==='auto' ? (mq.matches?'dark':'light') : p);
    document.documentElement.setAttribute('data-theme',eff);
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta){
      const c=getComputedStyle(document.documentElement).getPropertyValue('--paper').trim();
      if(c) meta.content=c;
    }
    const btn=document.getElementById('themebtn');
    if(btn){
      btn.textContent=LABEL[p];
      btn.setAttribute('aria-label','Tema: '+LABEL[p]+' — clique para trocar');
      btn.title='Tema (auto → claro → escuro)';
    }
  }

  // modo auto acompanha o sistema ao vivo
  if(mq.addEventListener) mq.addEventListener('change',()=>apply());
  else if(mq.addListener) mq.addListener(()=>apply());

  // impressão sempre no claro (o @media print assume papel branco)
  window.addEventListener('beforeprint',()=>apply('light'));
  window.addEventListener('afterprint',()=>apply());

  document.addEventListener('DOMContentLoaded',()=>{
    const btn=document.getElementById('themebtn');
    if(btn) btn.onclick=()=>{ setPref(MODES[(MODES.indexOf(pref())+1)%MODES.length]); apply(); };
    apply();   // de novo, agora com o botão no DOM
  });

  apply();
})();

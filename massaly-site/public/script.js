const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let framePending = false;
function updateScroll() { if (reducedMotion.matches) { document.documentElement.style.setProperty('--scroll',0); document.documentElement.style.setProperty('--neuron-opacity','.08'); return; } if (!framePending) { framePending = true; requestAnimationFrame(() => { const max = Math.max(1, document.documentElement.scrollHeight - innerHeight); document.documentElement.style.setProperty('--scroll', Math.min(1, scrollY / max).toFixed(4));  framePending = false; }); } }
addEventListener('scroll', updateScroll, {passive:true});
reducedMotion.addEventListener('change', updateScroll);
updateScroll();

// Re-arm reveals outside the viewport, including content above a restored scroll position.
const revealTargets = [...document.querySelectorAll('.hero-copy > *, .hero-art, .section-grid > div, .subpage-heading, .bibliography-row, .publication, .member-row, .roster-section > h2, .job > div, .legal-heading, .legal-body > section, .contact-grid > div, .contact-details > div, .contact-details > address, .statement')];
let revealObserver;
function setupReveals() {
  revealObserver?.disconnect();
  revealTargets.forEach(el => el.classList.remove('reveal-pending', 'is-visible'));
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add('is-visible');
      } else {
        const box = entry.boundingClientRect;
        if (box.bottom <= 0 || box.top >= innerHeight) {
          el.style.setProperty('--reveal-y', box.bottom <= 0 ? '-20px' : '20px');
          el.classList.remove('is-visible');
        }
      }
    });
  }, {threshold:0});
  revealTargets.forEach(el => {
    const box = el.getBoundingClientRect();
    const center = box.left + box.width / 2;
    el.style.setProperty('--reveal-x', center < innerWidth * .45 ? '-22px' : center > innerWidth * .55 ? '22px' : '0px');
    el.style.setProperty('--reveal-y', box.bottom <= 0 ? '-20px' : '20px');
    el.classList.add('reveal-pending');
    void el.offsetWidth;
    revealObserver.observe(el);
  });
}
setupReveals();
addEventListener('pageshow', event => { if (event.persisted) setupReveals(); });
reducedMotion.addEventListener('change',setupReveals);

const flip = document.querySelector('.logo-flip');
if (flip) {
  let pinned = false, hovering = false, keyboardFocused = false;
  const updateFlip = () => {
    const shown = pinned || hovering || keyboardFocused;
    flip.classList.toggle('is-flipped',shown);
    flip.setAttribute('aria-pressed',String(shown));
    flip.setAttribute('aria-label',shown ? 'David Geffen School of Medicine logo shown; toggle logo' : 'Massaly Laboratory logo shown; show David Geffen School of Medicine logo');
    flip.querySelector('.logo-front').setAttribute('aria-hidden',String(shown));
    flip.querySelector('.logo-back').setAttribute('aria-hidden',String(!shown));
  };
  flip.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovering=true;updateFlip();}});
  flip.addEventListener('pointerleave',()=>{hovering=false;updateFlip();});
  flip.addEventListener('focus',()=>{keyboardFocused=flip.matches(':focus-visible');updateFlip();});
  flip.addEventListener('blur',()=>{keyboardFocused=false;pinned=false;updateFlip();});
  flip.addEventListener('click',()=>{hovering=false;keyboardFocused=false;pinned=!flip.classList.contains('is-flipped');updateFlip();});
  flip.addEventListener('keydown',e=>{if(e.key==='Escape'){pinned=false;hovering=false;keyboardFocused=false;updateFlip();}});
}

const paperForm = document.querySelector('.publication-filters');
if (paperForm) {
  const list = document.querySelector('.bibliography');
  const rows = [...list.querySelectorAll('.bibliography-row')];
  const search = document.querySelector('#paper-search');
  const year = document.querySelector('#paper-year');
  const topic = document.querySelector('#paper-topic');
  const sort = document.querySelector('#paper-sort');
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  rows.forEach((row,index) => {
    row.dataset.year = row.querySelector('.pub-year').textContent.trim();
    row.dataset.search = normalize(row.textContent);
    const title = normalize(row.querySelector('h2').textContent);
    row.dataset.topics = Object.entries({pain:/pain|analges/,opioid:/opioid|opiat|morphine|fentanyl|carfentanyl/,reward:/reinforce|reward|memory|memories|hippocamp|contextual|anhedonia/,technology:/device|wireless|implant/,metabolism:/glucose|apelin|jejunum|diabetic/}).filter(([,pattern])=>pattern.test(title)).map(([key])=>key).join(' ');
    const citation = [...row.querySelectorAll('.citation')][1]?.textContent || '';
    const date = citation.match(/\b(19\d{2}|20\d{2})(?:\s+([A-Za-z]{3})(?:\s+(\d{1,2}))?)?/);
    row.dataset.date = date ? String(Number(date[1])*10000+(months.indexOf((date[2]||'').toLowerCase())+1)*100+Number(date[3]||0)) : String(Number(row.dataset.year)*10000);
    row.dataset.order = index;
  });
  function filterPapers() {
    const words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let count = 0;
    const sorted = [...rows].sort((a,b)=>(sort.value==='oldest'?1:-1)*(Number(a.dataset.date)-Number(b.dataset.date)) || Number(a.dataset.order)-Number(b.dataset.order));
    sorted.forEach(row=>{
      const show = (!year.value || row.dataset.year===year.value) && (!topic.value || row.dataset.topics.split(' ').includes(topic.value)) && words.every(word=>row.dataset.search.includes(word));
      row.hidden = !show;
      if(show) {count++;row.classList.add('is-visible');}
      list.appendChild(row);
    });
    document.querySelector('#paper-count').textContent = count+' of '+rows.length+' publications';
    document.querySelector('#paper-empty').hidden = count!==0;
  }
  paperForm.addEventListener('submit',event=>event.preventDefault());
  paperForm.addEventListener('input',filterPapers);
  paperForm.addEventListener('change',filterPapers);
  paperForm.addEventListener('reset',()=>setTimeout(filterPapers,0));
  // Sort on load without suppressing entry animations.
  filterPapers();
  setupReveals();
}

// Ignore tiny scroll movements; softly illuminate only during sustained scrolling.
let neuronGlowTimer, lastGlowY = scrollY, glowDistance = 0;
function stopNeuronGlow() {
  clearTimeout(neuronGlowTimer);
  glowDistance = 0;
  document.documentElement.classList.remove('neurons-scrolling');
}
addEventListener('scroll', () => {
  const distance = Math.abs(scrollY-lastGlowY);
  lastGlowY = scrollY;
  if (reducedMotion.matches) return stopNeuronGlow();
  glowDistance += distance;
  document.documentElement.style.setProperty("--shine-position", (50 + 45 * Math.sin(scrollY / 500)).toFixed(2)+"%");
  if(glowDistance >= 90) document.documentElement.classList.add('neurons-scrolling');
  clearTimeout(neuronGlowTimer);
  neuronGlowTimer = setTimeout(stopNeuronGlow, 180);
}, {passive:true});
addEventListener('blur',stopNeuronGlow);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopNeuronGlow();});
reducedMotion.addEventListener('change',stopNeuronGlow);

const mouseRail = document.querySelector('.footer-mouse-rail');
if (mouseRail) {
  const mouse = mouseRail.querySelector('.footer-mouse');
  let mouseX = 0, targetX = 0, mouseFrame = 0, previousTime = 0;
  const maxMouseX = () => Math.max(0, mouseRail.clientWidth-mouse.offsetWidth);
  function drawMouse() { mouse.style.left = mouseX+'px'; }
  function walkMouse(time) {
    const dt = previousTime ? Math.min((time-previousTime)/1000,.04) : .016;
    previousTime = time;
    targetX = Math.max(0,Math.min(maxMouseX(),targetX));
    const difference = targetX-mouseX;
    if (Math.abs(difference)<.2 || reducedMotion.matches) {
      mouseX = Math.max(0,Math.min(maxMouseX(),mouseX)); drawMouse();
      mouse.classList.remove('is-walking'); mouseFrame=0;previousTime=0;return;
    }
    mouse.style.setProperty('--mouse-facing', difference<0 ? '-1':'1');
    mouseX += Math.sign(difference)*Math.min(Math.abs(difference),dt*360);
    mouseX = Math.max(0,Math.min(maxMouseX(),mouseX));
    drawMouse(); mouse.classList.add('is-walking');
    mouseFrame=requestAnimationFrame(walkMouse);
  }
  document.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch'||reducedMotion.matches)return;
    const bounds=mouseRail.getBoundingClientRect();
    if(bounds.bottom<0||bounds.top>innerHeight)return;
    targetX=Math.max(0,Math.min(maxMouseX(),event.clientX-bounds.left-mouse.offsetWidth/2));
    if(!mouseFrame)mouseFrame=requestAnimationFrame(walkMouse);
  },{passive:true});
  addEventListener('resize',()=>{mouseX=Math.min(mouseX,maxMouseX());targetX=Math.min(targetX,maxMouseX());drawMouse();});
  reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches){cancelAnimationFrame(mouseFrame);mouseFrame=0;previousTime=0;mouse.classList.remove('is-walking');}});
}

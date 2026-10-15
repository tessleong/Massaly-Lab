from pathlib import Path
import re,html
D=Path('dist')
for p in D.glob('*.html'):
 s=p.read_text().replace('<a href="/#approach">Our approach</a>','<a href="/"'+(' aria-current="page"' if p.name=='index.html' else '')+'>Home</a>')
 s=re.sub(r'/script.js(?:\?v=[^" ]+)?','/script.js?v=refinements-3',s);s=re.sub(r'/style.css(?:\?v=[^" ]+)?','/style.css?v=refinements-3',s)
 if p.name=='contact.html':s=s.replace('subject=Post%20doctoral%20Position%28s%29%20Application','subject=Post%20doctoral%20Position%20Application')
 if p.name=='our-team.html':
  s=s.replace('class="wrap subpage"','class="wrap subpage team-page"')
  def member(m):
   name,role=m.groups();initials=''.join(w[0] for w in html.unescape(name).split(',')[0].split()[:2])
   return '<article class="member-row"><div class="portrait-slot" aria-hidden="true"><span>'+initials+'</span></div><div class="member-content"><h3>'+name+'</h3>'+role+'</div></article>'
  s=re.sub(r'<div class="member-row"><h3>(.*?)</h3>(.*?)</div>',member,s)
 if p.name=='publications.html':
  rows=re.findall(r'<article class="bibliography-row">.*?</article>',s)
  years=sorted({re.search(r'class="pub-year">(\d+)',r)[1] for r in rows},reverse=True)
  controls='<form class="publication-filters" role="search" aria-label="Filter publications"><label class="keyword-filter">Keywords or author<input id="paper-search" type="search" placeholder="e.g. pain, dynorphin, hippocampus" autocomplete="off"></label><label>Year<select id="paper-year"><option value="">All years</option>'+''.join('<option>'+y+'</option>' for y in years)+'</select></label><label>Main idea<select id="paper-topic"><option value="">All topics</option><option value="pain">Pain</option><option value="opioid">Opioids</option><option value="reward">Reward &amp; memory</option><option value="technology">Technology</option><option value="metabolism">Metabolism</option></select></label><label>Sort by<select id="paper-sort"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label><button class="filter-reset" type="reset">Reset</button></form><p id="paper-count" role="status" aria-live="polite">20 publications</p><p id="paper-empty" hidden>No publications match these filters. Try a different keyword or reset the filters.</p>'
  s=s.replace('<div class="bibliography">',controls+'<div class="bibliography">')
 p.write_text(s)
p=D/'script.js';s=p.read_text();s=s.replace("'.section-grid > div, .subpage-heading", "'.hero-copy > *, .hero-art, .section-grid > div, .subpage-heading")
s=s.replace("    if (box.top < innerHeight && box.bottom > 0) el.classList.add('is-visible');\n",'')
s=s.replace('    revealObserver.observe(el);','    void el.offsetWidth;\n    revealObserver.observe(el);')
s=s.replace("addEventListener('pageshow', setupReveals);","addEventListener('pageshow', event => { if (event.persisted) setupReveals(); });")
s+='''
const paperForm = document.querySelector('.publication-filters');
if (paperForm) {
  const list = document.querySelector('.bibliography');
  const rows = [...list.querySelectorAll('.bibliography-row')];
  const search = document.querySelector('#paper-search');
  const year = document.querySelector('#paper-year');
  const topic = document.querySelector('#paper-topic');
  const sort = document.querySelector('#paper-sort');
  const normalize = text => text.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();
  const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  rows.forEach((row,index) => {
    row.dataset.year = row.querySelector('.pub-year').textContent.trim();
    row.dataset.search = normalize(row.textContent);
    const title = normalize(row.querySelector('h2').textContent);
    row.dataset.topics = Object.entries({pain:/pain|analges/,opioid:/opioid|opiat|morphine|fentanyl|carfentanyl/,reward:/reinforce|reward|memory|memories|hippocamp|contextual|anhedonia/,technology:/device|wireless|implant/,metabolism:/glucose|apelin|jejunum|diabetic/}).filter(([,pattern])=>pattern.test(title)).map(([key])=>key).join(' ');
    const citation = [...row.querySelectorAll('.citation')][1]?.textContent || '';
    const date = citation.match(/\\b(19\\d{2}|20\\d{2})(?:\\s+([A-Za-z]{3})(?:\\s+(\\d{1,2}))?)?/);
    row.dataset.date = date ? String(Number(date[1])*10000+(months.indexOf((date[2]||'').toLowerCase())+1)*100+Number(date[3]||0)) : String(Number(row.dataset.year)*10000);
    row.dataset.order = index;
  });
  function filterPapers() {
    const words = normalize(search.value.trim()).split(/\\s+/).filter(Boolean);
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
''';p.write_text(s)
p=D/'style.css';s=p.read_text()+'''
/* Editorial profiles and publication tools */
.team-page .subpage-heading .intro{max-width:none}.team-page .roster-section{display:block}.team-page .roster-section>h2{margin-bottom:35px}.team-page .member-row{display:grid;grid-template-columns:150px 1fr;gap:36px;padding:30px 0;align-items:start}.portrait-slot{aspect-ratio:4/5;background:#f2f2f0;border:1px solid var(--line);display:grid;place-items:center;color:#888;font-size:28px;letter-spacing:.05em}.member-content{padding-top:8px;max-width:760px}.member-content h3{margin-bottom:12px}.member-content p{line-height:1.7}.team-page #alumni .member-row{grid-template-columns:80px 1fr;gap:28px}.team-page #alumni .portrait-slot{font-size:20px}.publication-filters{display:flex;flex-wrap:wrap;align-items:end;gap:16px;padding-top:28px}.publication-filters label{display:flex;flex-direction:column;gap:9px;font-size:14px;flex:1 1 140px}.publication-filters .keyword-filter{flex:2 1 270px}.publication-filters input,.publication-filters select{font:inherit;color:var(--ink);background:#fff;border:1px solid #a9a9a9;border-radius:0;padding:12px;height:46px;min-width:0;width:100%}.publication-filters :focus-visible{outline:2px solid var(--red);outline-offset:3px}.filter-reset{height:46px;border:1px solid var(--ink);background:var(--ink);color:white;font:inherit;font-size:14px;padding:0 20px;cursor:pointer}#paper-count{font-size:14px;color:var(--muted);margin:18px 0 24px}#paper-empty{padding:28px 0;font-size:17px}.bibliography-row[hidden],#paper-empty[hidden]{display:none!important}.hero-art.reveal-pending{overflow:visible}.team-page .member-row:first-child{border-top:1px solid var(--line)}@media(max-width:720px){.team-page .member-row{grid-template-columns:90px 1fr;gap:20px}.portrait-slot{font-size:22px}.team-page #alumni .member-row{grid-template-columns:65px 1fr;gap:20px}.team-page .member-content h3{font-size:20px}.publication-filters label{flex-basis:130px}.publication-filters .keyword-filter{flex-basis:100%}}
''';p.write_text(s)
print('Updated navigation, entry animations, publication filters, team profiles, and email subject.')

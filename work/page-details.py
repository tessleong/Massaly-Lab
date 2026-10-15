from pathlib import Path
import re
D=Path('dist')
for p in D.glob('*.html'):
 s=p.read_text();s,n=re.subn(r'<link rel="icon"[^>]*>','<link rel="icon" type="image/webp" href="/logo.webp">',s);assert n==1
 s=re.sub(r'/style.css\?v=[^" ]+','/style.css?v=page-details-10',s);p.write_text(s)
p=D/'our-team.html';s=p.read_text();a=s.index('<section class="roster-section">');b=s.index('<section class="roster-section" id="alumni">');current=s[a:b]
def bio(m):
 row=m[0];name=re.search(r'<h3>(.*?)</h3>',row)[1]
 return row.replace('</article>','<div class="member-bio" aria-label="Biography for '+name+'"><p>Biography coming soon.</p></div></article>')
current=re.sub(r'<article class="member-row">.*?</article>',bio,current);s=s[:a]+current+s[b:];p.write_text(s)
p=D/'our-research.html';s=p.read_text().replace('class="wrap subpage"','class="wrap subpage research-page"');p.write_text(s)
p=D/'publications.html';s=p.read_text();s,n=re.subn(r'\bMassaly N(?=[*,. ])',r'<strong>Massaly N</strong>',s);assert n==20,n;p.write_text(s)
p=D/'contact.html';s=p.read_text();a=s.index('<div class="contact-details">');b=s.index('<section id="positions"',a);block=s[a:b];s=s[:a]+s[b:]
block=block.replace('<address>Massaly Laboratory','<div class="contact-location"><address><strong>Massaly Laboratory</strong>')
map_html=re.search(r'<div class="location-map">.*?</div>',(D/'index.html').read_text())[0]
block=block.replace('</address>','</address>'+map_html+'</div>');s=s.replace('</main>',block+'</main>');p.write_text(s)
p=D/'style.css';s=p.read_text()+'''
.research-page .subpage-heading .intro{max-width:none}.team-page .roster-section:not(#alumni) .member-row{grid-template-columns:150px minmax(210px,.8fr) minmax(260px,1.2fr)}.member-bio{border:1px solid var(--line);min-height:160px;padding:24px;background:rgba(255,255,255,.8)}.member-bio p{font-size:15px;color:#777;margin:0;line-height:1.7}.citation strong{font-weight:700;color:var(--ink)}.contact-details{border-top:1px solid var(--line);margin-top:30px}.contact-location strong{font-weight:700;color:var(--ink)}.contact-location .location-map{max-width:100%}.contact-location .location-map iframe{border-color:var(--line)}@media(max-width:1000px){.team-page .roster-section:not(#alumni) .member-row{grid-template-columns:120px 1fr}.member-bio{grid-column:2;min-height:120px}}@media(max-width:720px){.team-page .roster-section:not(#alumni) .member-row{grid-template-columns:90px 1fr}.member-bio{grid-column:1/-1;padding:20px}}
''';p.write_text(s)
print('Added 8 biography placeholders; bolded 20 author names; updated favicon, research intro and contact order/map.')

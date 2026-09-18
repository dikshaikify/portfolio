const $=(s)=>document.querySelector(s), $$=(s)=>[...document.querySelectorAll(s)];
const progress=$('#progress');
window.addEventListener('scroll',()=>{const h=document.documentElement.scrollHeight-innerHeight;progress.style.width=(h?scrollY/h*100:0)+'%';});

// Mobile navigation
$('#menuBtn').addEventListener('click',()=>$('#navLinks').classList.toggle('open'));
$$('.nav-links a').forEach(a=>a.addEventListener('click',()=>$('#navLinks').classList.remove('open')));

// Theme
const themeBtn=$('#themeBtn');
const saved=localStorage.getItem('diksha-theme');
if(saved==='light') document.body.classList.add('light');
themeBtn.addEventListener('click',()=>{document.body.classList.toggle('light');localStorage.setItem('diksha-theme',document.body.classList.contains('light')?'light':'dark');themeBtn.innerHTML=document.body.classList.contains('light')?'<i class="fa-solid fa-moon"></i>':'<i class="fa-solid fa-sun"></i>';});

// Typing effect
const roles=['Full Stack Developer','CSE Student','DSA Problem Solver','Open Source Contributor'];
let ri=0,ci=0,deleting=false;
function type(){const el=$('#typedRole'), word=roles[ri];el.textContent=word.slice(0,ci);if(!deleting){ci++;if(ci>word.length){deleting=true;return setTimeout(type,1100)}}else{ci--;if(ci===0){deleting=false;ri=(ri+1)%roles.length}}setTimeout(type,deleting?45:75)}type();

// Reveal on scroll
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
$$('.reveal').forEach(el=>observer.observe(el));

// Active navigation
const sections=$$('main section[id]');
const navObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){$$('.nav-links a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-35% 0px -55% 0px'});sections.forEach(s=>navObserver.observe(s));

// Cursor glow + subtle tilt
const glow=$('#cursorGlow');window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});
$$('.tilt').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(800px) rotateY(${x*8}deg) rotateX(${-y*8}deg)`}));
$$('.tilt').forEach(card=>card.addEventListener('pointerleave',()=>card.style.transform='rotate(3deg)'));

// Project filters
$$('#filters button').forEach(btn=>btn.addEventListener('click',()=>{ $$('#filters button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;$$('.project-card').forEach(card=>{card.classList.toggle('hide',f!=='all'&&!card.dataset.category.split(' ').includes(f))}) }));

// Project detail modal
const details={
 style:{title:'E-Commerce Style Wardrobe',text:'A responsive e-commerce inspired project with category filtering and product browsing, built as a practical frontend project.',stack:['TypeScript','Responsive UI','Filtering']},
 auth:{title:'User Authentication & JWT',text:'A full authentication workflow with registration, login, password hashing, JWT authorization, protected routes and API integration.',stack:['Node.js','Express','MongoDB','bcrypt','JWT']},
 team:{title:'Team Availability Tracker',text:'A team dashboard designed around REST APIs and live availability updates, with a backend service and real-time communication.',stack:['Node.js','Express','MongoDB','Socket.IO','REST API']},
 hate:{title:'Hate Speech Detection',text:'A machine-learning NLP project covering text preprocessing, tokenization, feature extraction and classification using Python and scikit-learn.',stack:['Python','NLP','scikit-learn','Machine Learning']}
};
const modal=$('#modal');
$$('.details').forEach(btn=>btn.addEventListener('click',()=>{const d=details[btn.dataset.detail];$('#modalTitle').textContent=d.title;$('#modalText').textContent=d.text;$('#modalStack').innerHTML=d.stack.map(x=>`<span>${x}</span>`).join('');modal.classList.add('show')}));
$('#modalClose').addEventListener('click',()=>modal.classList.remove('show'));modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show')});document.addEventListener('keydown',e=>{if(e.key==='Escape')modal.classList.remove('show')});

// GitHub public repositories
async function loadRepos(){const box=$('#repoGrid');try{const res=await fetch('https://api.github.com/users/dikshaikify/repos?sort=updated&per_page=6');if(!res.ok)throw new Error('GitHub API');const repos=await res.json();if(!repos.length){box.innerHTML='<div class="repo-loading">No public repositories returned.</div>';return}box.innerHTML=repos.map(r=>`<a class="repo glass" href="${r.html_url}" target="_blank" rel="noreferrer"><div class="gh-top"><i class="fa-brands fa-github"></i><span>${r.language||'Repository'}</span></div><h4>${escapeHtml(r.name)}</h4><p>${escapeHtml(r.description||'Public repository by Diksha Koppad.')}</p><div class="repo-foot"><span>★ ${r.stargazers_count}</span><span>⑂ ${r.forks_count}</span><span>Updated ${new Date(r.updated_at).toLocaleDateString()}</span></div></a>`).join('')}catch(err){box.innerHTML='<div class="repo-loading">GitHub repositories could not be loaded right now. <a href="https://github.com/dikshaikify" target="_blank">Open GitHub</a></div>'}}
function escapeHtml(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}loadRepos();

$('#year').textContent=new Date().getFullYear();

// Certificate filters
const certFilters = $$('.cert-filter');
const certCards = $$('.cert-card[data-cert]');
certFilters.forEach(btn=>{
  btn.addEventListener('click',()=>{
    certFilters.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter=btn.dataset.certFilter;
    certCards.forEach(card=>{
      const show=filter==='all'||card.dataset.cert===filter;
      card.classList.toggle('hidden-cert',!show);
    });
    const visible=certCards.filter(c=>!c.classList.contains('hidden-cert')).length;
    const count=$('#certCount'); if(count) count.textContent=visible;
  });
});

// Add a little live time/status detail without any external API.
const statusDot=document.querySelector('.status-dot');
if(statusDot){
  const statusText=statusDot.parentElement;
  statusText.setAttribute('title','Currently open to internship and software opportunities');
}

// Active navigation is initialized once above.

// Tilt effect for cards on pointer devices
$$('.glass').forEach(card=>{
  card.addEventListener('pointermove',e=>{
    if(matchMedia('(pointer: coarse)').matches) return;
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`translateY(-3px) rotateX(${(-y*2.2).toFixed(2)}deg) rotateY(${(x*2.2).toFixed(2)}deg)`;
  });
  card.addEventListener('pointerleave',()=>{card.style.transform='';});
});

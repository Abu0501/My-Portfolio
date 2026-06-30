document.getElementById('year').textContent = new Date().getFullYear();

// header scroll state
const header = document.getElementById('siteHeader');
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
  toTop.classList.toggle('show', window.scrollY > 500);
});
toTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

// mobile nav
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
navToggle.addEventListener('click', () => {
  const open = navList.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
navList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navList.classList.remove('open');
  navToggle.setAttribute('aria-expanded', false);
}));

// smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const target = document.querySelector(a.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// scroll reveal + skill bars
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      if(entry.target.querySelector('.bar-fill')){
        entry.target.querySelectorAll('.bar-fill').forEach(bar=>{
          bar.style.width = bar.dataset.width + '%';
        });
      }
      io.unobserve(entry.target);
    }
  });
}, {threshold:0.18});
revealEls.forEach(el=>io.observe(el));

// profile image fallback if profile.jpg is missing
const profileImg = document.getElementById('profileImg');
if(profileImg){
  profileImg.addEventListener('error', () => {
    profileImg.replaceWith(Object.assign(document.createElement('div'), {
      className: 'photo-fallback',
      innerHTML: '<span>Add<br>profile.jpg</span>'
    }));
  }, { once:true });
}

// typing terminal
const termBody = document.getElementById('termBody');
const lines = [
  {type:'cmd', text:'python manage.py runserver'},
  {type:'out', text:'Watching for file changes with StatReloader'},
  {type:'out', text:'Django version 5.0, using settings "core.settings"'},
  {type:'out', text:'Starting development server at http://127.0.0.1:8000/'},
  {type:'cmd', text:'whoami --role'},
  {type:'out', text:'Abdullah S · Django Developer · Open to work'}
];
let li = 0, ci = 0;
function typeLine(){
  if(li >= lines.length){
    termBody.innerHTML += '<span class="prompt">$</span> <span class="caret"></span>';
    return;
  }
  const line = lines[li];
  if(ci === 0){
    const div = document.createElement('div');
    div.id = 'currentLine';
    if(line.type === 'cmd'){
      div.innerHTML = '<span class="prompt">$</span> ';
    } else {
      div.className = 'out';
    }
    termBody.appendChild(div);
  }
  const current = document.getElementById('currentLine');
  if(ci < line.text.length){
    if(line.type==='cmd'){
      current.innerHTML = '<span class="prompt">$</span> ' + line.text.slice(0, ci+1) + '<span class="caret"></span>';
    } else {
      current.textContent = line.text.slice(0, ci+1);
    }
    ci++;
    setTimeout(typeLine, line.type==='cmd' ? 38 : 10);
  } else {
    current.removeAttribute('id');
    if(line.type==='cmd'){
      current.innerHTML = '<span class="prompt">$</span> ' + line.text;
    }
    ci = 0; li++;
    setTimeout(typeLine, line.type==='cmd' ? 280 : 160);
  }
}
// start typing once terminal is in view
const termObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      typeLine();
      termObserver.disconnect();
    }
  });
}, {threshold:0.3});
termObserver.observe(document.querySelector('.terminal'));

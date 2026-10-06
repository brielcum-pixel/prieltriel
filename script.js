// Minimal JS: nav, reveal, modal, form, year. No frameworks.
(function(){
  var btn=document.getElementById('menuBtn');
  var menu=document.getElementById('mobileMenu');
  if(btn&&menu){
    btn.addEventListener('click',function(){
      var open=menu.hasAttribute('hidden');
      if(open){menu.removeAttribute('hidden');btn.setAttribute('aria-expanded','true');}
      else{menu.setAttribute('hidden','');btn.setAttribute('aria-expanded','false');}
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){menu.setAttribute('hidden','');btn.setAttribute('aria-expanded','false');});
    });
  }
  // active nav on scroll
  var links=document.querySelectorAll('.nav-link');
  var map={home:null,work:null,services:null,about:null,contact:null};
  Object.keys(map).forEach(function(id){map[id]=document.getElementById(id);});
  function onScroll(){
    var y=window.scrollY+120,current='home';
    Object.keys(map).forEach(function(id){var el=map[id];if(el&&el.offsetTop<=y)current=id;});
    links.forEach(function(l){l.classList.toggle('is-active',l.getAttribute('href')==='#'+current);});
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  // restrained reveal
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  // case modal
  var modal=document.getElementById('caseModal');
  function openModal(){if(modal){modal.hidden=false;document.body.style.overflow='hidden';}}
  function closeModal(){if(modal){modal.hidden=true;document.body.style.overflow='';}}
  document.querySelectorAll('[data-open-case]').forEach(function(b){b.addEventListener('click',openModal);});
  document.querySelectorAll('[data-close-case]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();closeModal();});});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();});

  // contact form — front-end only, opens email client
  var form=document.getElementById('contactForm');
  var note=document.getElementById('formNote');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(!form.checkValidity()){note.textContent='Please fill name, a valid email, project type, and message.';form.reportValidity();return;}
      var d=new FormData(form);
      var subject='New project inquiry — '+d.get('type')+' — '+d.get('name');
      var body='Name: '+d.get('name')+'\nEmail: '+d.get('email')+'\nProject type: '+d.get('type')+'\n\n'+d.get('message');
      window.location.href='mailto:hello@alvinhenrypriel.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      note.textContent='Opening your email app — or write directly to hello@alvinhenrypriel.com';
      form.reset();
    });
  }
  var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
})();

// Minimal JS: nav, reveal, case studies, accessible form, year. No frameworks.
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

  var links=document.querySelectorAll('.nav-link');
  var ids=['home','services','system','work','approach','process','tools','about','testimonials','exploring','contact'];
  function onScroll(){
    var y=window.scrollY+140,current='home';
    ids.forEach(function(id){var el=document.getElementById(id);if(el&&el.offsetTop<=y)current=id;});
    links.forEach(function(l){
      var href=l.getAttribute('href');
      var on=(href==='#'+current)||(current==='system'&&href==='#services')||(current==='approach'&&href==='#about')||(current==='exploring'&&href==='#contact');
      l.classList.toggle('is-active',on);
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  var CASES={
    gazu:{
      kicker:'Case study / Website',
      title:'Fashion e-commerce storefront',
      rows:[
        ['Project','A full storefront design sample: editorial hero, category journeys, campaign band, structured product grid.'],
        ['Challenge','Make a large catalog feel curated and shoppable on any screen size.'],
        ['Strategy','Lead with one strong hero story, then give every category a clear path to product.'],
        ['What I built','Hero composition, men/women/kids journeys, campaign section, product grid with trust signals.'],
        ['Result','Design sample. Measured outcomes are shared only from real launches, available on a call.']
      ]
    },
    seo:{
      kicker:'Case study / SEO',
      title:'Search visibility work',
      rows:[
        ['Project','Technical and on-page SEO engagement aimed at rankings that convert.'],
        ['Challenge','Turn search traffic into real enquiries, not just visits.'],
        ['Strategy','Fix the technical base first, then structure pages around terms buyers actually use.'],
        ['What I built','Technical cleanup, on-page optimization, keyword structure, local setup where relevant.'],
        ['Result','No public metrics. Verified numbers are shared only with client permission.']
      ]
    },
    automation:{
      kicker:'Case study / Automation',
      title:'Lead automation workflow',
      rows:[
        ['Project','One connected flow for capture, qualification, follow-up, and booking.'],
        ['Challenge','Leads arriving after hours with no consistent follow-up.'],
        ['Strategy','Answer every lead in minutes and route only qualified ones to a call.'],
        ['What I built','Capture forms, qualification logic, automated follow-ups, booking, CRM integration.'],
        ['Result','No public metrics. Workflow details are walked through live on a call.']
      ]
    }
  };

  var modal=document.getElementById('caseModal');
  var caseKicker=document.getElementById('caseKicker');
  var caseTitle=document.getElementById('caseTitle');
  var caseList=document.getElementById('caseList');
  var lastFocus=null;
  function openModal(key){
    var c=CASES[key];if(!c||!modal)return;
    lastFocus=document.activeElement;
    caseKicker.textContent=c.kicker;caseTitle.textContent=c.title;caseList.innerHTML='';
    c.rows.forEach(function(r){
      var li=document.createElement('li');
      var s=document.createElement('strong');s.textContent=r[0];
      li.appendChild(s);li.appendChild(document.createTextNode(r[1]));
      caseList.appendChild(li);
    });
    modal.hidden=false;document.body.style.overflow='hidden';
    var close=modal.querySelector('.modal-close');if(close)close.focus();
  }
  function closeModal(){
    if(!modal||modal.hidden)return;
    modal.hidden=true;document.body.style.overflow='';
    if(lastFocus&&lastFocus.focus)lastFocus.focus();
  }
  document.querySelectorAll('[data-open-case]').forEach(function(b){
    b.addEventListener('click',function(){openModal(b.getAttribute('data-open-case'));});
  });
  document.querySelectorAll('[data-close-case]').forEach(function(b){
    b.addEventListener('click',function(e){e.preventDefault();closeModal();if(b.getAttribute('href')==='#contact'){document.getElementById('contact').scrollIntoView({behavior:'smooth'});}});
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();});

  var form=document.getElementById('contactForm');
  var note=document.getElementById('formNote');
  function setInvalid(id,bad){var f=document.getElementById(id);if(!f)return;var wrap=f.closest('.field');if(wrap)wrap.classList.toggle('invalid',bad);f.setAttribute('aria-invalid',bad?'true':'false');}
  if(form){
    ['fName','fEmail','fType','fMsg'].forEach(function(id){
      var f=document.getElementById(id);
      if(f)f.addEventListener('input',function(){setInvalid(id,false);});
    });
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var name=document.getElementById('fName'),email=document.getElementById('fEmail'),
          type=document.getElementById('fType'),msg=document.getElementById('fMsg');
      var ok=true;
      var badName=!name.value.trim();setInvalid('fName',badName);if(badName)ok=false;
      var badEmail=!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim());setInvalid('fEmail',badEmail);if(badEmail)ok=false;
      var badType=!type.value;setInvalid('fType',badType);if(badType)ok=false;
      var badMsg=msg.value.trim().length<5;setInvalid('fMsg',badMsg);if(badMsg)ok=false;
      if(!ok){note.textContent='Please review the highlighted fields.';return;}
      var subject='New project inquiry: '+type.value+' / '+name.value.trim();
      var body='Name: '+name.value.trim()+'\nEmail: '+email.value.trim()+'\nProject type: '+type.value+'\n\n'+msg.value.trim();
      window.location.href='mailto:hello@alvinhenrypriel.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      note.textContent='Opening your email app. You can also write directly to hello@alvinhenrypriel.com.';
      form.reset();
    });
  }
  var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
})();

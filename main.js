/* NASSAR DEV */
(function () {
  'use strict';

  var WA_NUMBER = '201121067337';
  var KEY = 'nassar-lang';
  var radioEn = document.getElementById('lang-en');
  var radioAr = document.getElementById('lang-ar');
  var TITLES = {
    ar: 'NASSAR DEV | مطوّر مواقع ومتاجر إلكترونية',
    en: 'NASSAR DEV | Web Developer for Websites & Online Stores'
  };

  function currentLang() {
    return radioEn && radioEn.checked ? 'en' : 'ar';
  }

  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.title = TITLES[lang];
    var fields = document.querySelectorAll('[data-ph-ar]');
    for (var i = 0; i < fields.length; i++) {
      fields[i].placeholder = fields[i].getAttribute(lang === 'en' ? 'data-ph-en' : 'data-ph-ar');
    }
  }

  if (radioEn && radioAr) {
    /* Arabic is always the default. English only via the switch or ?lang=en */
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    var wantsEn = /[?&]lang=en\b/.test(window.location.search);
    if (wantsEn) { radioEn.checked = true; } else { radioAr.checked = true; }
    applyLang(currentLang());

    radioEn.addEventListener('change', function () { if (radioEn.checked) { applyLang('en'); } });
    radioAr.addEventListener('change', function () { if (radioAr.checked) { applyLang('ar'); } });
  }

  /* Close the mobile menu after choosing a link */
  var toggle = document.getElementById('nav-toggle');
  var links = document.querySelectorAll('.nav__link');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function () { if (toggle) { toggle.checked = false; } });
  }

  /* Highlight the nav link of the section currently in view */
  if ('IntersectionObserver' in window && links.length) {
    var map = {};
    for (var j = 0; j < links.length; j++) {
      map[links[j].getAttribute('href').slice(1)] = links[j];
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        for (var id in map) { map[id].classList.remove('is-active'); }
        if (map[entry.target.id]) { map[entry.target.id].classList.add('is-active'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    for (var id in map) {
      var section = document.getElementById(id);
      if (section) { observer.observe(section); }
    }
  }

  /* Contact form: open WhatsApp with the message ready to send */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.reportValidity()) { return; }

      var lang = currentLang();
      var name = form.elements.name.value.trim();
      var phone = form.elements.phone.value.trim();
      var text = form.elements.text.value.trim();

      var lines = lang === 'en'
        ? ['Hello, I am ' + name + '.']
        : ['أهلًا، أنا ' + name + '.'];
      lines.push(text);
      if (phone) { lines.push((lang === 'en' ? 'My number: ' : 'رقمي: ') + phone); }

      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
      var win = window.open(url, '_blank', 'noopener');
      if (!win) { window.location.href = url; }
    });
  }
})();

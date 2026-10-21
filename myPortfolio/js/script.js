const menu = document.querySelector('#menu');
const links = document.querySelector('#links');
const theme = document.querySelector('#theme');

if (menu && links) {
  menu.setAttribute('aria-expanded', 'false');
  menu.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(isOpen));
  });
  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    });
  });
}

if (theme) {
  theme.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    theme.textContent = isDark ? '☼' : '☾';
    theme.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((item) => observer.observe(item));
} else {
  items.forEach((item) => item.classList.add('visible'));
}

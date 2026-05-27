const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });
}

navItems.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

document.querySelectorAll('.reveal').forEach((element) => {
  revealObserver.observe(element);
});

const scrollCue = document.querySelector('.scroll-cue');
const pageSections = Array.from(document.querySelectorAll('main section[id]'));

const getCurrentSectionIndex = () => {
  const isAtPageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

  if (isAtPageBottom) {
    return pageSections.length - 1;
  }

  const currentPosition = window.scrollY + window.innerHeight * 0.38;
  let currentIndex = 0;

  pageSections.forEach((section, index) => {
    if (section.offsetTop <= currentPosition) {
      currentIndex = index;
    }
  });

  return currentIndex;
};

const updatePageState = () => {
  const currentIndex = getCurrentSectionIndex();
  const currentSection = pageSections[currentIndex];

  navItems.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentSection.id}`);
  });

  if (scrollCue) {
    const isLastSection = currentIndex === pageSections.length - 1;
    scrollCue.classList.toggle('is-up', isLastSection);
    scrollCue.setAttribute('aria-label', isLastSection ? 'Scroll back to top' : 'Scroll to next section');
  }
};

if (scrollCue && pageSections.length) {
  scrollCue.addEventListener('click', () => {
    const currentIndex = getCurrentSectionIndex();
    const nextSection = currentIndex === pageSections.length - 1
      ? pageSections[0]
      : pageSections[currentIndex + 1];

    nextSection.scrollIntoView({ behavior: 'smooth' });
  });
}

if (pageSections.length) {
  updatePageState();
  window.addEventListener('scroll', updatePageState, { passive: true });
  window.addEventListener('resize', updatePageState);
}

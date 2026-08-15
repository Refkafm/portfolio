const caseStudies = {
  xyz: {
    label: 'Mobile · Design system · Payment', title: 'XYZ White-Label', color: '#8f72ef',
    detailImage: 'assets/xyz.png',
    role: 'Product Designer', duration: 'Portfolio selection', team: 'Cross-functional product team',
    intro: 'A flexible mobile payment experience built for consumers and merchants.',
    story: 'XYZ was designed as a white-label product that could support secure transactions without feeling generic. I brought the core payment journey and reusable interface patterns into one adaptable experience that can work across different merchant brands.',
    results: [['Mobile', 'designed for everyday use'], ['Payments', 'clear transaction journeys'], ['System', 'adaptable interface patterns']]
  },
  ideal: {
    label: 'Healthtech · Web · SaaS', title: 'Ideal Protein', color: '#ec6f59',
    detailImage: 'assets/Ideal%20Protein.png',
    role: 'Product Designer', duration: '2024—2025', team: 'Product and healthcare teams',
    intro: 'One connected platform serving four very different healthcare roles.',
    story: 'Ideal Protein needed to support clinics, coaches, dieters, and healthcare providers without turning the product into a maze. I shaped the experience around each role’s priorities while maintaining a consistent structure across the wider platform.',
    results: [['4 roles', 'within one ecosystem'], ['Web', 'accessible across devices'], ['SaaS', 'built for ongoing care']]
  },
  unbox: {
    label: 'Web3 · Design system · 2022—2024', title: 'Design System Unbox', color: '#c8ff65',
    detailImage: 'assets/Design%20System.png',
    role: 'Product Designer', duration: '2022—2024', team: 'Unbox the Universe',
    intro: 'A shared design foundation that brings consistency to a growing Web3 ecosystem.',
    story: 'As products and brand variants evolved, the system needed to remain useful rather than merely documented. I refined its visual foundations and reusable components, then explored a Figma MCP workflow to make the transition from design to implementation more reliable.',
    results: [['Foundations', 'a coherent visual language'], ['Components', 'patterns teams can reuse'], ['Figma MCP', 'a closer design-code link']]
  },
  hublr: {
    label: 'Mobile · Social networking', title: 'Hublr', color: '#f3c7dc',
    detailImage: 'assets/Hublr.png',
    role: 'Product Designer', duration: 'Portfolio selection', team: 'Mobile product team',
    intro: 'A more considered way for Muslim communities to form meaningful connections.',
    story: 'Hublr applies familiar mobile dating patterns to a more specific cultural context. The experience was shaped to feel approachable and modern while remaining mindful of the expectations and values of its intended community.',
    results: [['Mobile', 'focused interaction design'], ['Connection', 'a familiar, simple journey'], ['Community', 'designed with context in mind']]
  }
};

const dialog = document.querySelector('#case-dialog');
const dialogContent = dialog.querySelector('.dialog-content');
const dialogScrollHint = dialog.querySelector('.dialog-scroll-hint');

function openCase(key) {
  const item = caseStudies[key];
  dialog.style.setProperty('--dialog-color', item.color);
  dialogContent.innerHTML = `
    <section class="dialog-hero"><p class="eyebrow">${item.label}</p><h2>${item.title}</h2></section>
    <section class="dialog-body">
      <aside class="dialog-facts">
        <div><small>Role</small><b>${item.role}</b></div>
        <div><small>Period / status</small><b>${item.duration}</b></div>
        <div><small>Team</small><b>${item.team}</b></div>
      </aside>
      <div class="dialog-story"><h3>${item.intro}</h3><p>${item.story}</p><div class="dialog-results">${item.results.map(([value,label]) => `<div><b>${value}</b><span>${label}</span></div>`).join('')}</div></div>
    </section>
    <figure class="dialog-case-image">
      <img src="${item.detailImage}" alt="Rangkaian desain ${item.title}" decoding="async">
    </figure>`;
  dialog.showModal();
  dialog.scrollTop = 0;
  dialogScrollHint.classList.remove('is-hidden');
  document.body.classList.add('dialog-open');
}

document.querySelectorAll('.project').forEach(project => {
  project.addEventListener('click', () => openCase(project.dataset.project));
  project.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openCase(project.dataset.project); }
  });
});

dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialogScrollHint.addEventListener('click', () => {
  const details = dialog.querySelector('.dialog-body');
  if (details) dialog.scrollTo({ top: details.offsetTop, behavior: 'smooth' });
});
dialog.addEventListener('scroll', () => {
  dialogScrollHint.classList.toggle('is-hidden', dialog.scrollTop > 90);
}, { passive: true });
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); } });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const cursor = document.querySelector('.cursor');
window.addEventListener('pointermove', event => {
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
});
document.querySelectorAll('.project').forEach(project => {
  project.addEventListener('pointerenter', () => cursor.classList.add('visible'));
  project.addEventListener('pointerleave', () => cursor.classList.remove('visible'));
});

window.addEventListener('pointermove', event => {
  document.querySelectorAll('[data-float]').forEach(note => {
    const speed = Number(note.dataset.float);
    note.style.translate = `${(event.clientX - innerWidth / 2) * speed}px ${(event.clientY - innerHeight / 2) * speed}px`;
  });
});

function updateTime() {
  const time = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
  document.querySelector('#local-time').textContent = time;
}
updateTime(); setInterval(updateTime, 30000);

document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const target = document.querySelector(link.getAttribute('href'));
  if (target) { event.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
}));

const testimonialCarousel = document.querySelector('.testimonial-carousel');
if (testimonialCarousel) {
  const testimonialSlides = [...testimonialCarousel.querySelectorAll('.testimonial-slide')];
  const testimonialCount = document.querySelector('.testimonial-count');
  const previousTestimonial = document.querySelector('[data-testimonial-prev]');
  const nextTestimonial = document.querySelector('[data-testimonial-next]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let testimonialIndex = 0;
  let testimonialTimer;

  function showTestimonial(nextIndex) {
    testimonialIndex = (nextIndex + testimonialSlides.length) % testimonialSlides.length;
    testimonialSlides.forEach((slide, index) => {
      const isActive = index === testimonialIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    testimonialCount.textContent = `${String(testimonialIndex + 1).padStart(2, '0')} / ${String(testimonialSlides.length).padStart(2, '0')}`;
  }

  function stopTestimonialAutoplay() {
    window.clearInterval(testimonialTimer);
  }

  function startTestimonialAutoplay() {
    stopTestimonialAutoplay();
    if (!reduceMotion) testimonialTimer = window.setInterval(() => showTestimonial(testimonialIndex + 1), 7000);
  }

  previousTestimonial.addEventListener('click', () => {
    showTestimonial(testimonialIndex - 1);
    startTestimonialAutoplay();
  });
  nextTestimonial.addEventListener('click', () => {
    showTestimonial(testimonialIndex + 1);
    startTestimonialAutoplay();
  });
  testimonialCarousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showTestimonial(testimonialIndex + (event.key === 'ArrowRight' ? 1 : -1));
      startTestimonialAutoplay();
    }
  });
  testimonialCarousel.closest('.testimonial-block').addEventListener('mouseenter', stopTestimonialAutoplay);
  testimonialCarousel.closest('.testimonial-block').addEventListener('mouseleave', startTestimonialAutoplay);
  testimonialCarousel.closest('.testimonial-block').addEventListener('focusin', stopTestimonialAutoplay);
  testimonialCarousel.closest('.testimonial-block').addEventListener('focusout', startTestimonialAutoplay);
  document.addEventListener('visibilitychange', () => document.hidden ? stopTestimonialAutoplay() : startTestimonialAutoplay());

  showTestimonial(0);
  startTestimonialAutoplay();
}

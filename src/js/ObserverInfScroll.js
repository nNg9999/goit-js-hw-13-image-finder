import { loadArticles } from './pixabay';

const infScrollObserver = target => {
  const options = {
    root: document.querySelector('#gallery-lis'),
    rootMargin: '100px',
    threshold: 0.01,
  };

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadArticles();
      }
    });
  }, options);

  io.observe(target);
};

export { infScrollObserver };

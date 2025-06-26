'use strict';

const COLORS = ['blue', 'purple', 'pink'];

/**
 * Scroll Event
 */
window.addEventListener('scroll', function () {
  const $elements = document.querySelectorAll('.scroll_item');
  $elements.forEach(($element, index) => {
    const elementPos = $element.getBoundingClientRect();
    console.log('elementPos.top', elementPos.top);
    console.log('elementPos.bottom', elementPos.bottom);
    console.log('window.innerHeight', window.innerHeight);

    if (elementPos.top < window.innerHeight && elementPos.bottom >= 0) {
      $element.classList.add('animated');
      $elements[index].classList.add(COLORS[index]);
    }
  });
});

/**
 * IntersectionObserver API
 */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      console.log('intersectionObserver API', entry);
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        entry.target.classList.add(entry.target.dataset.color);
      }
    });
  },
  { threshold: 0.8 },
);

document.querySelectorAll('.intersection_item').forEach(($element, index) => {
  $element.dataset.color = COLORS[index];
  observer.observe($element);
});

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const setupAnimations = (): void => {
  gsap.utils.toArray<HTMLElement>('.js-fadeIn').forEach((el: HTMLElement) => {
    gsap.fromTo(
      el,
      { opacity: 0.5, y: 100, scale: 0.5 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'center center',
          scrub: 1,
          toggleActions: 'play none none reverse',
        },
      },
    );
  });
};

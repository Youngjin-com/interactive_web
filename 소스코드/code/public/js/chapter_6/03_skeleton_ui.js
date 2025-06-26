'use strict';

const DELAY = 1000 * 1.5;

// 요소를 보여주도록 하는 함수
const show = ($elem) => ($elem.style.display = 'block');
// 요소를 보여주지 않도록 하는 함수
const hide = ($elem) => ($elem.style.display = 'none');
// 카드 UI 아이템들을 DELAY에 따라서 순차적으로 보여주는 함수
const showItems = ($elem, $loader, idx) => {
  setTimeout(
    () => {
      hide($loader);
      $elem.classList.remove('hidden');
    },
    DELAY * (idx + 1),
  );
};

const initSkeleton = ($elem, idx) => {
  const $skeleton = document.querySelector('.skeleton').cloneNode(true);
  show($skeleton);
  $elem.appendChild($skeleton);
  showItems($elem, $skeleton, idx);
};

document.addEventListener('DOMContentLoaded', () => {
  [...document.querySelectorAll('.card_list .card')].forEach(($element, index) => initSkeleton($element, index));
});

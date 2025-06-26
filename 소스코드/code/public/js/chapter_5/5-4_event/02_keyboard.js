'use strict';

/**
 * DOMContentLoaded - HTML DOM 트리가 렌더링이 완료 된 다음, 추가적인 스크립트가 다운로드되고 실행될 때 발생합니다.
 * @see
 * https://developer.mozilla.org/ko/docs/Web/API/Document/DOMContentLoaded_event
 */
document.addEventListener('DOMContentLoaded', () => {
  const $keyContainers = document.querySelectorAll('.key_container');
  const $info = document.querySelector('.js-info');
  const $refresh = document.querySelector('.js-refresh');
  const keys = ['Q', 'W', 'E', 'R', 'A', 'S', 'D', 'F', 'Z', 'X', 'C', 'V'];
  const KEY_COUNT = 4;

  $keyContainers.forEach((container, containerIndex) => {
    for (let i = 0; i < KEY_COUNT; i++) {
      const keyIndex = containerIndex * KEY_COUNT + i;
      if (keyIndex < keys.length) {
        const key = keys[keyIndex];
        const $button = document.createElement('button');
        $button.textContent = key;
        $button.setAttribute('type', 'button');
        $button.dataset.key = key.toLowerCase();
        container.appendChild($button);
      }
    }
  });

  document.addEventListener('keydown', (event) => {
    const allowKeys = [...document.querySelectorAll('[data-type="keydown"] button')].map((key) => key.dataset.key);
    $info.textContent = `type = ${event.type}, key = ${event.key}`;
    console.log('KeyDown:', event.key);
    if (!allowKeys.includes(event.key)) {
      return;
    }
    const $target = document.querySelector(`[data-key="${event.key}"]`);
    $target.classList.add('pressed');
  });

  // document.addEventListener('keypress', (event) => {
  //   const allowKeys = [...document.querySelectorAll('[data-type="keypress"] button')].map((key) => key.dataset.key);
  //   $info.textContent = `type = ${event.type}, key = ${event.key}`;
  //   console.log('KeyPress:', event.key);
  //   if (!allowKeys.includes(event.key)) {
  //     return;
  //   }
  //   const $target = document.querySelector(`[data-key="${event.key}"]`);
  //   $target.classList.toggle('pressed');
  // });

  document.addEventListener('keyup', (event) => {
    const allowKeys = [...document.querySelectorAll('[data-type="keyup"] button')].map((key) => key.dataset.key);
    $info.textContent = `type = ${event.type}, key = ${event.key}`;
    console.log('KeyUp:', event.key);
    if (!allowKeys.includes(event.key)) {
      return;
    }
    const $target = document.querySelector(`[data-key="${event.key}"]`);
    $target.classList.add('pressed');
  });

  $refresh.addEventListener('click', () => {
    [...document.querySelectorAll(`[data-key]`)].forEach((key) => {
      key.classList.remove('pressed');
    });
    $info.textContent = '-';
  });
});

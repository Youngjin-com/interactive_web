'use strict';

const options = {
  mouse: false,
  keyboard: true,
  scaleFactor: 4,
};

const updatePupilPosition = (x, y, $pupil) => {
  $pupil.style.transform = `translate(${x}px, ${y}px)`;
};

const calculateDistance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const updatePupilPositionByMouse = (mouseEvent, $eye) => {
  const { clientX: mouseX, clientY: mouseY } = mouseEvent;
  const { left, top, width, height } = $eye.getBoundingClientRect();
  const eyeCenterX = left + width / 2;
  const eyeCenterY = top + height / 2;
  const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
  const distance = Math.min($eye.offsetWidth / options.scaleFactor, calculateDistance(mouseX, mouseY, eyeCenterX, eyeCenterY));

  updatePupilPosition(distance * Math.cos(angle), distance * Math.sin(angle), $eye.querySelector('.pupil'));
};

const updatePupilPositionByKeyboard = ({ target }) => {
  const inputLength = target.value.length;
  const maxInputLength = target.maxLength;
  const angle = ((inputLength / maxInputLength) * Math.PI) / 2 - Math.PI / 4;

  document.querySelectorAll('.eye .pupil').forEach(($pupil) => {
    const distance = options.scaleFactor;
    updatePupilPosition(distance * Math.sin(angle), distance * Math.cos(angle), $pupil);
  });
};

const toggleEyeIcon = (e) => {
  const $eyeIcon = e.target;
  const $character = document.querySelector('.character');
  const $input = $eyeIcon.parentElement.querySelector('input');
  const isPassword = 'password' === $input.type;

  if (isPassword) {
    $input.type = 'text';
    $eyeIcon.classList.add('icn_eye_close');
    $character.classList.add('close_half');
  } else {
    $input.type = 'password';
    $eyeIcon.classList.remove('icn_eye_close');
    $character.classList.remove('close_half');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const isPasswordType = (e) => 'password' === e.target.type;
  const $character = document.querySelector('.character');
  const toggleCloseClass = (condition) => $character.classList.toggle('close', condition);
  document.querySelectorAll('input').forEach(($input) => {
    $input.addEventListener('focus', (e) => {
      options.mouse = false;
      toggleCloseClass(isPasswordType(e));
    });

    $input.addEventListener('focusout', () => {
      options.mouse = true;
      $character.classList.remove('close');
    });

    $input.addEventListener('input', (e) => {
      if (!options.keyboard) return;
      isPasswordType(e) ? $character.classList.add('close') : updatePupilPositionByKeyboard(e);
    });
  });

  document.querySelector('.js-eye').addEventListener('click', toggleEyeIcon);
});

document.addEventListener('mousemove', (e) => {
  if (!options.mouse) return;
  document.querySelectorAll('.eye').forEach(($eye) => updatePupilPositionByMouse(e, $eye));
});

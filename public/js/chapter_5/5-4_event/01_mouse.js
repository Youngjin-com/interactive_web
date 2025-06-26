'use strict';

const $canvas = document.querySelector('.js-painter');
const $context = $canvas.getContext('2d');
const $colorPicker = document.querySelector('.js-colorPicker input');
const $pencilRange = document.querySelector('.js-pencilRange input');
const $eraseAll = document.querySelector('.js-eraseAll');
const mouse = {
  isDown: false,
  x: 0,
  y: 0,
};
const initialValue = {
  color: '#3c3c3c',
  width: 10,
  lineCap: 'round',
};

/**
 * DOMContentLoaded - HTML DOM 트리가 렌더링이 완료 된 다음, 추가적인 스크립트가 다운로드되고 실행될 때 발생합니다.
 * @see
 * https://developer.mozilla.org/ko/docs/Web/API/Document/DOMContentLoaded_event
 */
document.addEventListener('DOMContentLoaded', () => {
  const { lineCap, color, width } = initialValue;
  $context.lineCap = lineCap;
  $context.strokeStyle = color;
  $context.lineWidth = width;
  $colorPicker.value = color;
  $pencilRange.value = width;
  $eraseAll.dispatchEvent(new Event('click'));
  $colorPicker.dispatchEvent(new Event('change'));
  $pencilRange.dispatchEvent(new Event('input'));
});

$colorPicker.addEventListener('change', (event) => {
  const color = event.target.value;
  event.target.parentElement.querySelector('.current_color_picker').innerHTML = color;
  $context.strokeStyle = color;
});

$pencilRange.addEventListener('input', (event) => {
  const width = event.target.value;
  event.target.parentElement.querySelector('.current_pencil_range').innerHTML = width + 'px';
  $context.lineWidth = width;
});

$canvas.addEventListener('mousedown', (event) => {
  mouse.isDown = true;
  [mouse.x, mouse.y] = [event.offsetX, event.offsetY];
});

$canvas.addEventListener('mouseup', () => {
  mouse.isDown = false;
});

$canvas.addEventListener('mouseout', () => {
  mouse.isDown = false;
});

$canvas.addEventListener('mousemove', (event) => {
  if (false === mouse.isDown) {
    return;
  }
  const [drawX, drawY] = [event.offsetX, event.offsetY];
  $context.beginPath();
  $context.moveTo(mouse.x, mouse.y);
  $context.lineTo(drawX, drawY);
  $context.stroke();
  mouse.x = drawX;
  mouse.y = drawY;
});

$eraseAll.addEventListener('click', () => {
  $context.clearRect(0, 0, $canvas.width, $canvas.height);
});

document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  mouse.isDown = false;
  if (false === confirm('초기화 하시겠습니까?')) {
    return;
  }
  const { lineCap, color, width } = initialValue;
  $context.lineCap = lineCap;
  $context.strokeStyle = color;
  $context.lineWidth = width;
  $colorPicker.value = color;
  $pencilRange.value = width;
  $eraseAll.dispatchEvent(new Event('click'));
  $colorPicker.dispatchEvent(new Event('change'));
  $pencilRange.dispatchEvent(new Event('input'));
});

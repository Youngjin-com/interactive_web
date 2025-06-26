'use strict';

/**
 * DOMContentLoaded - HTML DOM 트리가 렌더링이 완료 된 다음, 추가적인 스크립트가 다운로드되고 실행될 때 발생합니다.
 * @see
 * https://developer.mozilla.org/ko/docs/Web/API/Document/DOMContentLoaded_event
 */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login').addEventListener('submit', checkForm);
  document.querySelector('.readable .js-dateTime').addEventListener('click', (event) => renderDateTime(event));
  document.querySelector('.modulable .js-calculator').addEventListener('click', renderCalcResult);

  const userInfo = {
    name: 'yeongminKim',
    email: 'yeongmin@yeongmin.com',
    age: 38,
  };
  renderUserInfo(userInfo); // 초기 사용자 정보 렌더링
  document.querySelector('.maintainable .js-update').addEventListener('click', (e) => handleUpdateClick(e, userInfo));
});

/**
 * 함수의 재사용성 - form 유효성 검사(form validation)
 */
function isValidEmail(email) {
  const regex = /\S+@\S+\.com$/;
  return regex.test(email);
}

function isValidPassword(password) {
  return 10 <= password.length;
}

function checkForm(event) {
  // 폼의 기본 제출 동작 방지
  event.preventDefault();

  const $form = event.target;
  const $email = $form.querySelector('.form_email input');
  const $password = $form.querySelector('.form_password input');

  if (false === isValidEmail($email.value)) {
    $email.focus();
    alert('이메일을 확인해주세요.');
    return;
  } else if (false === isValidPassword($password.value)) {
    $password.focus();
    alert('비밀번호를 확인해주세요.');
    return;
  }
  alert('로그인에 성공했습니다.');
  $form.reset();
  $email.focus();
}

/**
 * 함수의 가독성 - 날짜와 시간 표시
 */
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  return date.toLocaleDateString('ko-KR', options);
}

function formatTime(date) {
  const options = { hour: '2-digit', minute: '2-digit' };
  return date.toLocaleTimeString('ko-KR', options);
}

function renderDateTime(event) {
  const $readable = event.target.closest('.readable');
  const $result = $readable.querySelector('.result');

  if ($result.innerText) {
    return;
  }

  const now = new Date();
  const $fragment = document.createDocumentFragment();
  const $date = document.createElement('p');
  const $time = document.createElement('p');
  $date.innerHTML = formatDate(now);
  $time.innerText = formatTime(now);
  $fragment.appendChild($date);
  $fragment.appendChild($time);
  $result.appendChild($fragment);
}

/**
 * 함수의 모듈성 - 세금 반영된 상품 계산
 * 10개 이상 구매시 할인율 20%
 * 세금 8%
 * 각 1,200원
 */
function formatCurrency(number) {
  return `${number.toLocaleString()}원`;
}

function calcResult(price, discount, tax) {
  const quantity = parseInt(prompt('구매할 상품의 수량을 입력하세요:'), 10);

  if (isNaN(quantity) || quantity <= 0) {
    return '올바른 수량을 입력하세요.';
  }

  let totalPrice = price * quantity;

  if (10 <= quantity) {
    totalPrice *= 1 - discount;
  }

  totalPrice *= 1 + tax;

  return formatCurrency(Math.round(totalPrice));
}

function renderCalcResult(event) {
  const $modulable = event.target.closest('.modulable');
  const $result = $modulable.querySelector('.result');
  const price = 1200;
  const discount = 0.2; // 20%;
  const tax = 0.08; // 8%

  $result.textContent = calcResult(price, discount, tax);
}

/**
 * 함수의 유지보수성 - 사용자 정보 업데이트
 */
function updateUserInfo(currentInfo, updateInfo) {
  const updatedUserInfo = { ...currentInfo };
  Object.entries(updateInfo).forEach(([key, newValue]) => {
    // 키가 존재하지 않거나, 타입이 일치하지 않거나, 값이 동일한 경우, 업데이트를 하지 않습니다.
    if (!(key in updatedUserInfo) || typeof newValue !== typeof updatedUserInfo[key] || updatedUserInfo[key] === newValue) {
      return;
    }
    // 모든 검사를 통과한 경우, 업데이트를 수행합니다.
    updatedUserInfo[key] = newValue;
  });
  return updatedUserInfo;
}

function handleUpdateClick(event, currentInfo) {
  const updateName = prompt('업데이트 할 이름을 입력하세요.');
  const updatedInfo = updateUserInfo(currentInfo, { name: updateName });
  renderUserInfo(updatedInfo);
}

function renderUserInfo(userInfo) {
  const $maintainable = document.querySelector('.maintainable');
  const $result = $maintainable.querySelector('.result');
  const { name, email, age } = userInfo;
  $result.innerHTML = `<p>name : ${name}</p>
  <p>email: ${email}</p>
  <p>age: ${age}</p>`;
}

'use strict';

const isValidEmail = function (email) {
  const regex = /\S+@\S+\.com$/;
  return regex.test(email);
};

const isValidPassword = function (password) {
  return 10 <= password.length;
};

const checkForm = function (event) {
  event.preventDefault();

  const $form = event.target;
  const $email = $form.querySelector('.form_email input');
  const $password = $form.querySelector('.form_password input');

  if (!isValidEmail($email.value)) {
    $email.focus();
    alert('이메일을 확인해주세요.');
    return;
  } else if (!isValidPassword($password.value)) {
    $password.focus();
    alert('비밀번호를 확인해주세요.');
    return;
  }
  alert('로그인에 성공했습니다.');
  $form.reset();
  $email.focus();
};

const formatDate = function (date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  return date.toLocaleDateString('ko-KR', options);
};

const formatTime = function (date) {
  const options = { hour: '2-digit', minute: '2-digit' };
  return date.toLocaleTimeString('ko-KR', options);
};

const renderDateTime = function (event) {
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
};

const formatCurrency = function (number) {
  return `${number.toLocaleString()}원`;
};

const calcResult = function (price, discount, tax) {
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
};

const renderCalcResult = function (event) {
  const $modulable = event.target.closest('.modulable');
  const $result = $modulable.querySelector('.result');
  const price = 1200;
  const discount = 0.2; // 20%;
  const tax = 0.08; // 8%

  $result.textContent = calcResult(price, discount, tax);
};

const updateUserInfo = function (currentInfo, updateInfo) {
  const updatedUserInfo = { ...currentInfo };
  Object.entries(updateInfo).forEach(([key, newValue]) => {
    if (!(key in updatedUserInfo) || typeof newValue !== typeof updatedUserInfo[key] || updatedUserInfo[key] === newValue) {
      return;
    }
    updatedUserInfo[key] = newValue;
  });
  return updatedUserInfo;
};

const handleUpdateClick = function (event, currentInfo) {
  const updateName = prompt('업데이트 할 이름을 입력하세요.');
  const updatedInfo = updateUserInfo(currentInfo, { name: updateName });
  renderUserInfo(updatedInfo);
};

const renderUserInfo = function (userInfo) {
  const $maintainable = document.querySelector('.maintainable');
  const $result = $maintainable.querySelector('.result');
  const { name, email, age } = userInfo;
  $result.innerHTML = `<p>name : ${name}</p>
  <p>email: ${email}</p>
  <p>age: ${age}</p>`;
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login').addEventListener('submit', checkForm);
  document.querySelector('.readable .js-dateTime').addEventListener('click', renderDateTime);
  document.querySelector('.modulable .js-calculator').addEventListener('click', renderCalcResult);

  const userInfo = {
    name: 'yeongminKim',
    email: 'yeongmin@yeongmin.com',
    age: 38,
  };
  renderUserInfo(userInfo);
  document.querySelector('.maintainable .js-update').addEventListener('click', (e) => handleUpdateClick(e, userInfo));
});

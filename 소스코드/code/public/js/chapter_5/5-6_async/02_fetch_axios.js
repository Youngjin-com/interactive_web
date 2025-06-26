'use strict';

const axios = window.axios;

const setLoader = (isShow) => {
  const $spinner = document.createElement('div');
  $spinner.classList.add('spinner');
  if (isShow && null === document.querySelector('.spinner')) {
    document.querySelector('.result').appendChild($spinner);
  } else {
    document.querySelector('.spinner')?.remove();
  }
};

const renderHTML = (data) => {
  const $result = document.querySelector('.result');
  $result.innerHTML = data;
};

const fetchAPI = () => {
  setLoader(true);
  fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then((response) => response.json())
    .then((json) => {
      setLoader(false);
      renderHTML(json.body);
    })
    .catch((error) => console.error('Fetch Error:', error));
};

const axiosAPI = () => {
  setLoader(true);
  axios
    .get('https://jsonplaceholder.typicode.com/posts/2')
    .then((response) => {
      setLoader(false);
      renderHTML(response.data.body);
    })
    .catch((error) => console.error('Axios Error:', error));
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.js-fetch').addEventListener('click', fetchAPI);
  document.querySelector('.js-axios').addEventListener('click', axiosAPI);
});

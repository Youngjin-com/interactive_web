import { get$, getAll$ } from '../utils.js';

/**
 * @function setTheme
 * @description 테마 설정
 * @param {string} theme - 설정할 테마 (default : light)
 */
const setTheme = (theme = 'light') => {
  document.documentElement.setAttribute('class', theme);
};

/**
 * @function themeChangeHandler
 * @description 테마 변경 핸들러
 * @param {MouseEvent} event - 클릭 이벤트 객체
 */
const themeChangeHandler = (event) => {
  const theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
  const $theme = event.target.closest('button').querySelector(`[data-theme="${theme}"]`);
  if ($theme) {
    setTheme($theme.dataset.theme);
  }
};

/**
 * @function setViewType
 * @description 뷰타입 값을 할당하는 함수
 * @param {string} [viewType] - 뷰 타입(default: thumbnail)
 */
const setViewType = (viewType = 'thumbnail') => {
  get$('.js-viewChange .active')?.classList.remove('active');
  get$(`.js-viewChange [data-type="${viewType}"]`)?.classList.add('active');
  get$('.js-viewType').dataset.type = viewType;
};

/**
 * @function viewChangeHandler
 * @description 뷰타입 변경 핸들러
 * @param {MouseEvent} event - 클릭 이벤트
 */
const viewChangeHandler = (event) => {
  const $target = event.target.closest('button');
  if (!$target || $target.classList.contains('active')) {
    return;
  }
  setViewType($target.dataset.type);
};

/**
 * @function toggleFavorite
 * @description 즐겨찾기 토글
 * @param {MouseEvent} event - 클릭 이벤트 객체
 */
const toggleFavorite = (event) => {
  if (!event.target.closest('button')) {
    return;
  }
  event.target.closest('.list').classList.toggle('active');
};

/**
 * @function getActiveFavorite
 * @description  즐겨찾기 상태
 * @param {Element[]} $favorites - 즐겨찾기 상태인 요소들
 */
const getActiveFavorite = ([...$favorites]) => {
  const result = $favorites.map(($element) => $element.classList.contains('active'));
  return JSON.stringify(result);
};

/**
 * @function setActiveFavorite
 * @description  즐겨찾기 상태 설정
 * @param {boolean[]} favorites - 즐겨찾기 상태 배열
 */
const setActiveFavorite = ([...favorites]) => {
  if (favorites.length <= 0) {
    return;
  }
  [...getAll$('.js-favorite .list')].forEach((list, index) => {
    list.classList.toggle('active', favorites[index]);
  });
};

/**
 * @function setSearch
 * @description  검색 설정
 * @param {string} search - URL 검색 쿼리
 */
const setSearch = (search) => {
  const searchKeyword = new URLSearchParams(search).get('searchWords');
  if (!searchKeyword) return;
  get$('#search').value = searchKeyword;
  [...getAll$('.js-viewContainer .list')].forEach(($element) => {
    if ($element.querySelector('.title').textContent.includes(searchKeyword)) {
      $element.style.display = 'block';
    } else {
      $element.style.display = 'none';
    }
  });
};

/**
 * @function openCommunity
 * @description 커뮤니티 열기
 */
const openCommunity = () => {
  get$('.js-community').classList.add('active');
};

/**
 * @function closeCommunity
 * @description 커뮤니티 닫기
 */
const closeCommunity = () => {
  get$('.js-community').classList.remove('active');
};

/**
 * @function notWorking
 * @description 미구현 기능 알림
 */
const notWorking = () => {
  alert('해당 부분을 직접 구현 해보세요.');
};

document.addEventListener('DOMContentLoaded', () => {
  setViewType(localStorage.getItem('viewType') ?? 'list');
  setTheme(localStorage.getItem('theme') ?? 'light');
  setActiveFavorite(JSON.parse(localStorage.getItem('favorites')) ?? []);
  setSearch(window.location.search);
  get$('body').style.visibility = 'visible';

  get$('.js-theme').addEventListener('click', themeChangeHandler);
  get$('.js-viewChange').addEventListener('click', viewChangeHandler);
  get$('.js-openCommunity').addEventListener('click', openCommunity);
  get$('.js-closeCommunity').addEventListener('click', closeCommunity);
  get$('.js-favorite').addEventListener('click', toggleFavorite);
  getAll$('.js-notWorking').forEach(($element) => $element.addEventListener('click', notWorking));
});

window.addEventListener('beforeunload', () => {
  localStorage.setItem('viewType', get$('.js-viewType').dataset.type);
  localStorage.setItem('theme', document.documentElement.getAttribute('class'));
  localStorage.setItem('favorites', getActiveFavorite([...getAll$('.js-favorite .list')]));
});

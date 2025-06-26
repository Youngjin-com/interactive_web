import { getAll$ } from '../utils.js';
import { observer } from './observer.js';
import { stateProxy } from './proxy.js';
import ThemeManager from './theme.js';

const themeManager = ThemeManager();

/**
 * @description stateProxy의 콜백으로 등록되어 URL의 해시가 변경될 때 호출
 * @param {string} hash - URL에서 새로운 해시 문자열
 */
const handleHashChange = (hash) => {
  const theme = hash.replace('#', '');
  themeManager.applyTheme(theme);
};

/**
 * @description stateProxy의 콜백으로, URL 해시 변경을 감지하면 handleHashChange를 호출
 * @param {string} hash - URL에서 새로운 해시 문자열
 */
stateProxy.callbackFunc = handleHashChange;

/**
 * @description  해시 변경 시 stateProxy의 상태를 업데이트
 */
window.addEventListener('hashchange', () => {
  stateProxy.currentState = window.location.hash;
});

/**
 * @description  사용자가 브라우저의 뒤로가기, 앞으로가기를 사용하거나, pushState/replaceState가 호출될 때 발생
 */
window.addEventListener('popstate', () => {
  themeManager.scrollToSection(window.location.hash.replace('#', ''));
});

/**
 * @description  문서 로드 완료 시 초기 해시에 따라 테마를 적용하고, 관찰자(observer)를 섹션에 등록
 */
window.addEventListener('DOMContentLoaded', () => {
  handleHashChange(window.location.hash);
  getAll$('.section').forEach(($section) => observer.observe($section));
  document.body.style.opacity = 1;
});

import { get$, getAll$ } from '../utils.js';

/**
 * @description 테마 변경과 관련된 기능을 제공하는 객체를 반환
 * @returns {Object} 테마를 적용하는 함수를 포함하는 객체
 */
const ThemeManager = () => {
  const themes = {
    flower: { background: '#ffc8f9', highlight: '#a84b99' },
    bluebird: { background: '#e6e6fa', highlight: '#2e6cb6' },
    heart: { background: '#ffd1dc', highlight: '#e64333' },
    banana: { background: '#fff2d4', highlight: '#fcc000' },
    orange: { background: '#ffeade', highlight: '#ff9861' },
  };

  /**
   * @description 현재 활성화된 링크의 'active' 클래스를 제거하고 새로운 테마에 해당하는 링크에 'active' 클래스를 추가
   * @param {string} theme - 활성화할 테마 이름
   */
  const setActiveNavLink = (theme) => {
    // 현재 활성화된 링크의 'active' 클래스를 제거
    getAll$('.navigation .active').forEach(($section) => $section.classList.remove('active'));
    // 새로운 테마에 해당하는 링크에 'active' 클래스 추가
    get$(`.navigation [href="#${theme}"]`)?.classList.add('active');
  };

  /**
   * @description 주어진 해시 이름을 사용하여 해당하는 ID를 가진 요소를 찾아 'active' 클래스를 추가하고, 이전에 활성화된 요소의 'active' 클래스를 제거
   * @param {string} hashName - URL의 해시
   */
  const activateSection = (hashName) => {
    const $targetSection = document.getElementById(hashName);
    // 기존에 활성화된 섹션의 'active' 클래스 제거
    getAll$('.section.active').forEach(($section) => $section.classList.remove('active'));
    // 새 섹션에 'active' 클래스 추가
    $targetSection?.classList.add('active');
  };

  /**
   * @description 주어진 해시에 해당하는 섹션을 활성화
   * @param {string} [hashName] - 활성화할 섹션의 ID
   */
  const scrollToSection = (hashName) => {
    const $targetSection = document.getElementById(hashName);
    if ($targetSection) {
      setTimeout(() => {
        $targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 1000 * 0.5);
    }
  };

  /**
   * @description 문서의 주요 스타일 속성을 변경하여 테마의 배경색, 강조색 및 이미지를 설정
   * @param {string} theme - 적용할 테마 이름
   */
  const applyTheme = (theme) => {
    if (!themes[theme]) return;
    const { background, highlight } = themes[theme];
    document.documentElement.style.setProperty('--color-background', background);
    document.documentElement.style.setProperty('--color-highlight', highlight);
    setActiveNavLink(theme);
    activateSection(theme);
  };

  return { applyTheme, scrollToSection };
};

export default ThemeManager;

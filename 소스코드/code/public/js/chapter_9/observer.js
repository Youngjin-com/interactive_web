import { stateProxy } from './proxy.js';

/**
 * @description 옵저버의 루트 요소, 마진, 임계값을 설정
 * @type {Object}
 */
const observerOptions = {
  root: null, // 뷰포트를 기준으로 설정
  rootMargin: '0px', // 루트 마진은 0px
  threshold: 0.5, // 50% 요소가 보이면 콜백 함수 실행
};

/**
 * 요소들의 교차 상태를 감지하는 IntersectionObserver 인스턴스
 * @description 페이지에 있는 특정 요소들이 사용자의 화면에 나타나거나 사라질 때 실행할 동작을 정의
 * @param {IntersectionObserverEntry[]} entries - 감지된 각 요소의 교차 상태 정보를 담고 있는 객체 배열
 */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // 요소가 화면에 교차하는 경우
    if (entry.isIntersecting) {
      const newHash = `#${entry.target.id}`; // 교차하는 요소의 ID를 해시로 사용
      // 현재 URL의 해시와 새로운 해시가 다르다면 URL 업데이트
      if (newHash !== window.location.hash) {
        history.pushState(null, null, newHash); // 브라우저 히스토리에 새로운 상태를 추가
        stateProxy.currentState = newHash; // 상태 프록시에 현재 상태를 업데이트
      }
    }
  });
}, observerOptions);

export { observer };

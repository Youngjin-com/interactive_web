/**
 * @description 애플리케이션의 현재 상태와 상태 변경 시 호출될 콜백 함수를 포함
 * @type {Object}
 */
const state = {
  currentState: null, // 현재 상태 (URL의 해시)
  callbackFunc: null, // 상태 변경 시 호출될 콜백 함수
};

/**
 * @description 상태 변경을 감지하고 적절한 콜백을 실행
 * @param {Object} target - 원본 state 객체
 * @param {string} property - 변경되는 속성의 이름
 * @param {*} value - 속성에 할당될 새로운 값
 * @returns {boolean} - 항상 true를 반환하여 성공적으로 값을 설정했음을 알림
 */
const stateProxy = new Proxy(state, {
  set(target, property, value) {
    console.log(`Property ${property} 변경: from ${target[property]} to ${value}`);
    target[property] = value;

    // currentState 속성이 변경되었을 때 콜백 함수 실행
    if ('currentState' === property && typeof target.callbackFunc === 'function') {
      target.callbackFunc(value);
    }
    return true;
  },
});

export { state, stateProxy };

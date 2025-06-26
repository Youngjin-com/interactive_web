/**
 * setAngle 함수
 *
 * 이 함수는 두 각도 사이의 가장 짧은 경로를 계산하여 부드러운 회전을 구현합니다.
 * 3D 공간에서 객체를 자연스럽게 회전시키는 데 사용됩니다.
 *
 * @param {number} start - 시작 각도 (라디안)
 * @param {number} end - 목표 각도 (라디안)
 * @param {number} t - 보간 계수 (0에서 1 사이의 값)
 * @returns {number} 계산된 새로운 각도 (라디안)
 */
export const setAngle = (start: number, end: number, t: number): number => {
  // 시작 각도와 목표 각도의 차이 계산
  let diff = end - start;

  // 각도 차이가 180도를 넘어가면 반대 방향으로 회전하는 것이 더 짧음
  // 이를 위해 각도 차이를 조정
  if (diff > Math.PI) diff -= Math.PI * 2;
  if (diff < -Math.PI) diff += Math.PI * 2;

  // 선형 보간(linear interpolation)을 사용하여 새로운 각도 계산
  return start + diff * t;
};

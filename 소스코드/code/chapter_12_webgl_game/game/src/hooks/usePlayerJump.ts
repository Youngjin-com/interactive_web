import { useState, useCallback } from 'react';
import * as THREE from 'three';
import { AnimationState } from '../types/type';

// 점프의 높이와 지속 시간을 정의합니다.
const JUMP_HEIGHT = 1.5;
const JUMP_DURATION = 0.5;

/**
 * usePlayerJump 훅
 *
 * 이 훅은 플레이어의 점프 기능을 관리합니다.
 * 점프 상태, 점프 함수, 그리고 관련 유틸리티 함수들을 제공합니다.
 *
 * @returns {Object} 점프 관련 상태와 함수들
 */
const usePlayerJump = () => {
  const [isJumping, setIsJumping] = useState(false);

  /**
   * 현재 실행 중인 애니메이션을 중지합니다.
   * @param {THREE.AnimationAction[]} actions - 애니메이션 액션 배열
   * @param {number} currentAnimation - 현재 애니메이션 인덱스
   */
  const stopCurrentAnimation = (actions: THREE.AnimationAction[], currentAnimation: number) => {
    actions[currentAnimation]?.stop();
  };

  /**
   * 점프 애니메이션을 시작합니다.
   * @param {THREE.AnimationAction[]} actions - 애니메이션 액션 배열
   */
  const startJumpAnimation = (actions: THREE.AnimationAction[]) => {
    actions[AnimationState.JUMP].reset().setLoop(THREE.LoopOnce, 1).play();
  };

  /**
   * 점프를 마무리하고 원래 상태로 돌아갑니다.
   * @param {React.RefObject<THREE.Group>} modelRef - 3D 모델 참조
   * @param {THREE.AnimationAction[]} actions - 애니메이션 액션 배열
   * @param {number} currentAnimation - 현재 애니메이션 인덱스
   * @param {number} startY - 점프 시작 시 Y 좌표
   */
  const finishJump = (modelRef: React.RefObject<THREE.Group>, actions: THREE.AnimationAction[], currentAnimation: number, startY: number) => {
    if (!modelRef.current) return;

    setIsJumping(false);
    actions[AnimationState.JUMP].stop();
    modelRef.current.position.y = startY;
    actions[currentAnimation]?.reset().play();
    applyLandingEffect(modelRef);
  };

  /**
   * 착지 효과를 적용합니다. 캐릭터를 잠시 눌렀다 펴는 효과를 줍니다.
   * @param {React.RefObject<THREE.Group>} modelRef - 3D 모델 참조
   */
  const applyLandingEffect = (modelRef: React.RefObject<THREE.Group>) => {
    if (!modelRef.current) return;

    const originalScale = modelRef.current.scale.y;
    modelRef.current.scale.y *= 0.9;
    setTimeout(() => {
      if (modelRef.current) modelRef.current.scale.y = originalScale;
    }, 100);
  };

  /**
   * jumpHook 함수
   *
   * 이 함수는 3D 캐릭터의 점프 동작을 구현합니다.
   *
   * @param {React.RefObject<THREE.Group>} modelRef - 3D 모델에 대한 참조
   * @param {THREE.AnimationAction[]} actions - 사용 가능한 애니메이션 액션 배열
   * @param {number} currentAnimation - 현재 실행 중인 애니메이션의 인덱스
   */
  const jumpHook = useCallback(
    (modelRef: React.RefObject<THREE.Group>, actions: THREE.AnimationAction[], currentAnimation: number) => {
      if (isJumping || !modelRef.current) return;

      setIsJumping(true);

      const startY = modelRef.current.position.y;
      const startTime = performance.now();

      stopCurrentAnimation(actions, currentAnimation);
      startJumpAnimation(actions);

      const animateJump = () => {
        if (!modelRef.current) return;

        const currentTime = performance.now();
        const elapsedTime = (currentTime - startTime) / 1000;
        const jumpProgress = Math.min(elapsedTime / JUMP_DURATION, 1);
        const heightOffset = Math.sin(jumpProgress * Math.PI) * JUMP_HEIGHT;
        modelRef.current.position.y = startY + heightOffset;

        if (jumpProgress < 1) {
          requestAnimationFrame(animateJump);
        } else {
          finishJump(modelRef, actions, currentAnimation, startY);
        }
      };

      requestAnimationFrame(animateJump);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isJumping],
  );

  return {
    isJumping,
    setIsJumping,
    jumpHook,
  };
};

export default usePlayerJump;

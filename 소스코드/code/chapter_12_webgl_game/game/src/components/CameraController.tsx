import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ICameraControllerProps {
  playerPosition: THREE.Vector3;
}

/**
 * CameraController 컴포넌트
 *
 * 이 컴포넌트는 3D 씬의 카메라를 제어합니다.
 * 플레이어의 위치에 따라 카메라를 움직이고, 윈도우 크기 변경에 대응합니다.
 *
 * @param {THREE.Vector3} playerPosition - 플레이어의 현재 위치
 */
const CameraController: React.FC<ICameraControllerProps> = ({ playerPosition }) => {
  // Three.js의 카메라와 화면 크기 정보를 가져옵니다.
  const { camera, size } = useThree();

  // 카메라의 오프셋 값을 설정합니다. 이 값으로 카메라와 플레이어 사이의 거리를 조절합니다.
  const cameraOffset = useRef(new THREE.Vector3(7, 5, 7));

  // 카메라가 바라보는 지점의 오프셋 값을 설정합니다. 플레이어보다 약간 위를 바라보게 합니다.
  const cameraLookAtOffset = useRef(new THREE.Vector3(0, 0.5, 0));

  useEffect(() => {
    // 카메라 설정을 업데이트하는 함수입니다.
    const updateCamera = () => {
      if (camera instanceof THREE.OrthographicCamera) {
        // 화면의 종횡비를 계산합니다.
        const aspect = size.width / size.height;
        // 새로운 프러스텀 크기를 계산합니다.
        const newFrustumSize = 5 * Math.max(1, aspect);

        // 카메라의 프러스텀을 업데이트합니다.
        camera.left = (-newFrustumSize * aspect) / 4;
        camera.right = (newFrustumSize * aspect) / 4;
        camera.top = newFrustumSize / 4;
        camera.bottom = -newFrustumSize / 4;
        camera.updateProjectionMatrix();
      }
    };

    // 초기 카메라 설정을 업데이트합니다.
    updateCamera();

    // 윈도우 크기 변경 시 카메라 설정을 업데이트합니다.
    window.addEventListener('resize', updateCamera);

    // 컴포넌트 언마운트 시 이벤트 리스너를 제거합니다.
    return () => window.removeEventListener('resize', updateCamera);
  }, [camera, size]);

  // 매 프레임마다 카메라 위치 및 시점 업데이트
  useFrame(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      // 카메라의 목표 위치를 계산합니다.
      const cameraPosition = new THREE.Vector3().addVectors(playerPosition, cameraOffset.current);
      // 카메라를 부드럽게 목표 위치로 이동시킵니다.
      camera.position.lerp(cameraPosition, 0.1);

      // 카메라가 바라볼 위치를 계산합니다.
      const lookAtPosition = new THREE.Vector3().addVectors(playerPosition, cameraLookAtOffset.current);
      // 카메라가 계산된 위치를 바라보도록 합니다.
      camera.lookAt(lookAtPosition);
    }
  });

  // 이 컴포넌트는 UI를 렌더링하지 않고 카메라 제어만 담당합니다.
  return null;
};

export default CameraController;

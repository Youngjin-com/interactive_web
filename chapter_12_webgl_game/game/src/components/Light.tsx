import { useThree } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Light 컴포넌트
 *
 * 이 컴포넌트는 3D 씬의 조명을 설정합니다.
 * 환경광(Ambient Light)과 방향광(Directional Light)을 포함합니다.
 * 방향광은 그림자를 생성하도록 설정되어 있습니다.
 */
const Light: React.FC = () => {
  const { scene } = useThree();
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const helperRef = useRef<THREE.DirectionalLightHelper | null>(null);

  useEffect(() => {
    if (directionalLightRef.current) {
      const helper = new THREE.DirectionalLightHelper(directionalLightRef.current, 20);
      helperRef.current = helper;
      scene.add(helper);
      return () => {
        if (helperRef.current) {
          scene.remove(helperRef.current);
        }
      };
    }
  }, [scene]);
  return (
    <>
      {/* 환경광: 전체적인 기본 조명 제공 */}
      <ambientLight
        intensity={0.6} // 환경광의 강도. 낮은 값으로 설정하여 전체적으로 부드러운 조명 효과를 줍니다.
      />

      {/* 방향광: 주요 조명과 그림자 생성 */}
      <directionalLight
        position={[50, 50, -25]} // 광원의 위치. 씬의 우측 상단에서 약간 앞쪽으로 위치
        intensity={1} // 조명의 강도. 1은 기본값으로, 밝고 선명한 조명을 제공합니다.
        castShadow // 그림자 생성 활성화. 이 조명에 의해 객체들이 그림자를 만들 수 있게 합니다.
        shadow-mapSize-width={4096} // 그림자 맵의 가로 해상도. 높은 값일수록 선명한 그림자를 만들지만 성능에 영향을 줄 수 있습니다.
        shadow-mapSize-height={4096} // 그림자 맵의 세로 해상도
        shadow-camera-far={200} // 그림자 카메라의 원거리 평면. 이 거리 이상으로는 그림자가 렌더링되지 않습니다.
        shadow-camera-left={-100} // 그림자 카메라의 좌측 평면
        shadow-camera-right={100} // 그림자 카메라의 우측 평면
        shadow-camera-top={100} // 그림자 카메라의 상단 평면
        shadow-camera-bottom={-100} // 그림자 카메라의 하단 평면
        shadow-bias={-0.0001} // 그림자 바이어스. 그림자 여드름(shadow acne)을 방지하기 위해 사용됩니다.
      />
    </>
  );
};

export default Light;

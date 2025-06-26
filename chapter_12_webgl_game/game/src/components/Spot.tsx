import React from 'react';
import { IPosition } from '../types/type';

interface ISpotProps {
  position: IPosition;
}

/**
 * Spot 컴포넌트
 *
 * 이 컴포넌트는 3D 씬에서 특정 위치를 표시하는 원형 스팟을 렌더링합니다.
 * 주로 플레이어의 목표 지점이나 중요한 위치를 나타내는 데 사용됩니다.
 *
 * @param {[number, number, number]} position - 스팟의 3D 위치 [x, y, z]
 */
const Spot: React.FC<ISpotProps> = ({ position }) => {
  return (
    <mesh position={[position.x, position.y, position.z]} rotation-x={-Math.PI / 2} receiveShadow>
      <circleGeometry args={[1.2, 20]} /> {/* 반지름 1.2, 20개의 세그먼트로 원 생성 */}
      <meshStandardMaterial color="red" transparent opacity={0.5} />
    </mesh>
  );
};

export default Spot;

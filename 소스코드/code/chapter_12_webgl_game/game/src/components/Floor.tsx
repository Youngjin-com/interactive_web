import { forwardRef } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface IFloorProps {
  textureUrl: string;
}

/**
 * Floor 컴포넌트
 *
 * 이 컴포넌트는 3D 씬의 바닥을 렌더링합니다.
 * - 텍스처를 로드하고 적용합니다.
 * - 그림자를 받도록 설정되어 있습니다.
 * - forwardRef를 사용하여 부모 컴포넌트에서 ref를 통해 직접 접근할 수 있게 합니다.
 *
 * @param {string} textureUrl - 바닥 텍스처의 URL
 * @param {React.Ref<THREE.Mesh>} ref - 메시에 대한 참조
 */
const Floor = forwardRef<THREE.Mesh, IFloorProps>(({ textureUrl }, ref) => {
  // 바닥 텍스처 로드
  const floorTexture = useLoader(THREE.TextureLoader, textureUrl);
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(100, 100);

  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} receiveShadow position={[0, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial map={floorTexture} roughness={0.8} metalness={0.2} />
    </mesh>
  );
});

export default Floor;

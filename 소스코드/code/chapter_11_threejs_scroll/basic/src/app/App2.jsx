import { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

//GSAP ScrollTrigger 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

// Box 컴포넌트
const Box = () => {
  // 3D 메시에 대한 참조 생성
  const meshRef = useRef();
  // 컴포넌트가 마운트된 후 애니메이션 설정
  useEffect(() => {
    // GSAP를 사용하여 메시의 회전 애니메이션을 정의
    gsap.to(meshRef.current.rotation, {
      x: Math.PI * 2, // X축으로 360도 회전
      y: Math.PI * 2, // Y축으로 360도 회전
      scrollTrigger: {
        trigger: '#wrap', // 스크롤 트리거 요소
        start: 'top top', // 애니메이션 시작 지점
        end: 'bottom bottom', // 애니메이션 종료 지점
        scrub: 1, // 부드러운 스크롤 효과
      },
    });
  }, []);

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="violet" roughness={0.5} metalness={0.5} />
    </mesh>
  );
};

// 3D 씬을 설정하는 컴포넌트
const Scene = () => {
  // Three.js의 카메라
  const { camera } = useThree();

  // 카메라 위치 설정
  useEffect(() => {
    camera.position.set(0, 0, 5);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={1} />
      <Box />
      <Environment preset="park" background />
    </>
  );
};

// 메인 App 컴포넌트
export default function App() {
  return (
    <>
      {/* 3D 캔버스 */}
      <Canvas shadows style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Scene />
      </Canvas>
      {/* 스크롤 영역 */}
      <div id="wrap" style={{ position: 'relative', width: '100%', height: '500vh' }}>
        <p style={{ position: 'absolute', top: '50vh', width: '100%', color: 'white', mixBlendMode: 'overlay' }}>스크롤 하세요.</p>
        <p style={{ position: 'absolute', top: '300vh', width: '100%', color: 'white', mixBlendMode: 'overlay' }}>계속 스크롤 해보세요.</p>
        <p style={{ position: 'absolute', top: '400vh', width: '100%', color: 'white', mixBlendMode: 'overlay' }}>거의 다 왔어요.</p>
      </div>
    </>
  );
}

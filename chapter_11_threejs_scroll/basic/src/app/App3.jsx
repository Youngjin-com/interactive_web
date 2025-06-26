import { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// eslint-disable-next-line react/prop-types
const Donut = ({ url }) => {
  const { scene } = useGLTF(url);
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

  return <primitive object={scene} ref={meshRef} scale={1.5} />;
};

// 3D 씬을 설정하는 컴포넌트
const Scene = () => {
  // Three.js의 카메라
  const { camera } = useThree();

  // 카메라 위치 및 애니메이션 설정
  useEffect(() => {
    camera.position.set(0, 0, 5);

    // GSAP를 사용하여 카메라 위치 애니메이션을 정의
    gsap.to(camera.position, {
      x: 6,
      y: 5,
      z: 4,
      scrollTrigger: {
        trigger: '#wrap',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    // 카메라 회전 애니메이션 추가
    gsap.to(camera.rotation, {
      x: -0.8,
      y: 1,
      z: 1.2,
      scrollTrigger: {
        trigger: '#wrap',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    });
  }, [camera]);

  return (
    <>
      <ambientLight intensity={1} />
      <Donut url="/donut.glb" />
      <Environment preset="park" background />
    </>
  );
};

export default function App() {
  return (
    <>
      {/* 3D 캔버스 */}
      <Canvas shadows style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Scene />
      </Canvas>
      {/* 스크롤 영역 */}
      <div id="wrap" style={{ position: 'relative', width: '100%', height: '500vh', fontSize: '3rem' }}>
        <p style={{ position: 'absolute', top: '50vh', width: '100%', color: 'white', mixBlendMode: 'overlay' }}>스크롤 하세요.</p>
        <p style={{ position: 'absolute', top: '300vh', width: '100%', color: 'white', mixBlendMode: 'overlay' }}>계속 스크롤 해보세요.</p>
        <p style={{ position: 'absolute', top: '400vh', width: '100%', color: 'white', mixBlendMode: 'overlay' }}>거의 다 왔어요.</p>
      </div>
    </>
  );
}

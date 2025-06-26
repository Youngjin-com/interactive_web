import { Suspense, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Donut } from './Donut';
import { gsap } from 'gsap';

/**
 * 3D 장면을 렌더링하는 React 컴포넌트
 * 스크롤에 따라 카메라 위치가 변경됨
 *
 * @param {Object} props - 컴포넌트 props
 * @param {boolean} props.isMobile - 모바일 환경 여부
 */
export const Scene = ({ isMobile }: { isMobile: boolean }) => {
  // useThree 훅을 사용하여 Three.js의 카메라 객체에 접근
  const { camera } = useThree();

  useEffect(() => {
    // 초기 카메라 위치 설정
    // x: 0 (중앙), y: 0 (수직 중앙), z: 모바일일 경우 4, 아닐 경우 3 (거리)
    // z값이 클수록 카메라가 더 멀리 위치하여 더 넓은 시야를 제공
    camera.position.set(0, 0, isMobile ? 4 : 3);

    // GSAP 타임라인 생성 및 스크롤 트리거 설정
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#wrap',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    // 데스크톱 환경에서의 카메라 애니메이션
    if (!isMobile) {
      tl.to(camera.position, {
        x: 1,
        y: 0.5,
        z: 3.5,
      })
        .to(camera.position, {
          x: -0.5,
          y: -0.5,
          z: 4,
        })
        .to(camera.position, {
          x: -0.5,
          y: -0.5,
          z: 2.5,
        });
      // 모바일 환경에서의 카메라 애니메이션
    } else {
      tl.to(camera.position, {
        y: -0.5,
        z: 3.5,
      });
    }
    // 카메라 객체나 isMobile 값이 변경될 때마다 이펙트 재실행
  }, [camera, isMobile]);

  // 매 프레임마다 카메라가 원점(0, 0, 0)을 바라보도록 설정
  useFrame(() => {
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* 배경색 설정 */}
      <color attach="background" args={['#ff8c42']} />

      {/* 전체적인 밝기를 위한 환경광 */}
      <ambientLight intensity={1.5} />
      {/* 오른쪽 위에서 비추는 직사광 */}
      <directionalLight position={[5, 5, 5]} intensity={1.8} />
      {/* 왼쪽 아래에서 비추는 점광원 */}
      <pointLight position={[-5, -5, -5]} intensity={1.5} />
      {/* 오른쪽 위에서 비추는 스포트라이트 angle - 빛의 퍼짐, penumbra - 빛의 가장자리 부드러움 */}
      <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1.8} castShadow />

      {/* Suspense를 사용하여 Donut 컴포넌트를 비동기적으로 로드 */}
      <Suspense fallback={null}>
        <Donut url="/donut.glb" isMobile={isMobile} />
      </Suspense>
    </>
  );
};

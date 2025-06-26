import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { Section } from './components/Section';
import { Content } from './components/Content';
import { useIsMobile } from './hooks/useIsMobile';
import { setupAnimations } from './hooks/useGsap';
import './App.css';

export default function App() {
  // 모바일 여부 확인을 위한 커스텀 훅 사용
  const isMobile = useIsMobile();

  // 주문 버튼 클릭 핸들러
  const handleOrderClick = () => {
    alert('Thank you for your order!');
  };

  // 컴포넌트 마운트 시 애니메이션 설정
  useEffect(() => {
    setupAnimations();
  }, []);

  return (
    <>
      {/* 3D 캔버스 설정 */}
      <Canvas shadows style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Scene isMobile={isMobile} />
      </Canvas>

      {/* 메인 컨텐츠 영역 */}
      <div id="wrap">
        {/* 첫 번째 섹션: 메인 타이틀 */}
        <Section bgColor="rgba(30, 60, 114, 0.15)">
          <div className="content main_content">
            <h1 className="title">Noel Donut</h1>
            <p className="description">A sweet moment melting in your mouth</p>
          </div>
        </Section>

        {/* 두 번째 섹션: 제품 특징 */}
        <Section bgColor="rgba(139, 69, 19, 0.15)">
          <Content title="Soft Sweetness" description="Experience a burst of rich flavor with every bite" />
        </Section>

        {/* 세 번째 섹션: 제품 다양성 */}
        <Section bgColor="rgba(160, 82, 45, 0.15)">
          <Content title="Variety of Flavors" description="From classic to seasonal specials, a donut for every taste" />
        </Section>

        {/* 네 번째 섹션: 주문 섹션 */}
        <Section bgColor="rgba(165, 42, 42, 0.2)">
          <Content title="Order Now" description="Taste the warm and fresh Noel Donuts today" buttonText="Place Order" onButtonClick={handleOrderClick} />
        </Section>
      </div>
    </>
  );
}

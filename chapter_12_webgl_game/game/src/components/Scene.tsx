import React, { useRef, useState } from 'react';
import { useThree, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import Player from './Player';
import Ball from './Ball';
import Floor from './Floor';
import Light from './Light';
import Spot from './Spot';
import CameraController from './CameraController';
import { OrthographicCamera } from '@react-three/drei';

// 상수 정의
const PLAYER_INITIAL_Y = 0.3;
const SPOT_POSITION = { x: 2, y: 0.01, z: 2 };
const BALL_VISIBILITY_THRESHOLD = 1.5;
const CLICK_DELAY = 200;

/**
 * Scene 컴포넌트
 *
 * 이 컴포넌트는 전체 3D 씬을 구성하고 관리합니다.
 * - 플레이어의 움직임을 제어합니다.
 * - 공의 가시성을 관리합니다.
 * - 포인터 이벤트(클릭, 드래그 등)를 처리합니다.
 * - 다양한 3D 요소(바닥, 조명, 스팟 등)를 포함합니다.
 */
const Scene: React.FC = () => {
  // 바닥 메시에 대한 참조
  const floorRef = useRef<THREE.Mesh>(null);
  // Three.js의 주요 객체들을 가져옵니다.
  const { raycaster, gl, camera } = useThree();

  // 상태 관리
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, PLAYER_INITIAL_Y, 0));
  const [playerTargetPosition, setPlayerTargetPosition] = useState(new THREE.Vector3(0, PLAYER_INITIAL_Y, 0));
  const [isBallVisible, setIsBallVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // 클릭 타이밍을 관리하기 위한 타임아웃 참조
  const clickTimeout = useRef<number | null>(null);

  /**
   * 포인터 위치를 3D 공간의 좌표로 변환하는 함수
   */
  const updatePointerPosition = (event: ThreeEvent<PointerEvent>) => {
    const canvas = gl.domElement;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    const intersects = raycaster.intersectObject(floorRef.current!, true);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      return new THREE.Vector3(point.x, PLAYER_INITIAL_Y, point.z);
    }
    return null;
  };

  /**
   * 포인터 다운 이벤트 핸들러
   * 클릭 또는 드래그 시작을 처리합니다.
   */
  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (clickTimeout.current) clearTimeout(clickTimeout.current);

    clickTimeout.current = window.setTimeout(() => {
      if (event.isPrimary) {
        setIsDragging(true);
        const newPosition = updatePointerPosition(event);
        if (newPosition) setPlayerTargetPosition(newPosition);
      }
    }, CLICK_DELAY);
  };

  /**
   * 포인터 이동 이벤트 핸들러
   * 드래그 중 플레이어의 목표 위치를 업데이트합니다.
   */
  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (isDragging && event.isPrimary) {
      const newPosition = updatePointerPosition(event);
      if (newPosition) setPlayerTargetPosition(newPosition);
    }
  };

  /**
   * 포인터 업 이벤트 핸들러
   * 클릭 또는 드래그 종료를 처리합니다.
   */
  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
    if (event.isPrimary) {
      setIsDragging(false);
      const newPosition = updatePointerPosition(event);
      if (newPosition) setPlayerTargetPosition(newPosition);
    }
  };

  const handlePointerLeave = () => {
    setIsDragging(false);
  };

  return (
    <>
      <group onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerLeave}>
        <Light />
        <OrthographicCamera makeDefault />
        <Floor ref={floorRef} textureUrl="/grass.png" />
        <Spot position={SPOT_POSITION} />
        <Player
          modelSrc="/manman.glb"
          targetPosition={playerTargetPosition}
          onPositionUpdate={(position) => {
            setPlayerPosition(position);
            // 플레이어가 특정 위치에 가까워지면 공을 보이게 함
            const distanceToBall = position.distanceTo(new THREE.Vector3(SPOT_POSITION.x, SPOT_POSITION.y, SPOT_POSITION.z));
            setIsBallVisible(distanceToBall < BALL_VISIBILITY_THRESHOLD);
          }}
        />
        <Ball modelSrc="/ball.glb" position={SPOT_POSITION} visible={isBallVisible} />
        <CameraController playerPosition={playerPosition} />
      </group>
    </>
  );
};

export default Scene;

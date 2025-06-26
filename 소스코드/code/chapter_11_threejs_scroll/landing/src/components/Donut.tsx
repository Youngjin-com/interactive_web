import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

interface IDonut {
  url: string;
  isMobile: boolean;
}

interface IRotation {
  x: number;
  y: number;
  z: number;
}

interface IMousePosition {
  x: number;
  y: number;
}

export const Donut: React.FC<IDonut> = ({ url, isMobile }) => {
  const { scene } = useGLTF(url);
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const rotationRef = useRef<IRotation>({ x: 0, y: 0, z: 0 });
  const isMouseDownRef = useRef<boolean>(false);
  const lastMousePositionRef = useRef<IMousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    scene.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        child.material.roughness = 0.2;
        child.material.metalness = 0.1;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#wrap',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    const startX = isMobile ? 0 : 1.2;
    const endX = isMobile ? 0 : 0.5;

    if (groupRef.current) {
      tl.fromTo(groupRef.current.position, { x: startX, y: -0.5 }, { x: endX, y: 0.5, z: -0.25 })
        .to(groupRef.current.scale, { x: 0.9, y: 0.9, z: 0.9 }, '<')
        .to(rotationRef.current, { x: Math.PI, y: Math.PI * 2, z: Math.PI }, '<')
        .to(groupRef.current.position, {
          y: 0,
          x: endX,
          z: 0,
        })
        .to(
          groupRef.current.scale,
          {
            x: isMobile ? 1.5 : 1.3,
            y: isMobile ? 1.5 : 1.3,
            z: isMobile ? 1.5 : 1.3,
          },
          '<',
        )
        .to(rotationRef.current, { x: Math.PI / 2, y: 0, z: 0 }, '<');
    }

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDownRef.current = true;
      lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMouseDownRef.current && groupRef.current) {
        const deltaMove = {
          x: e.clientX - lastMousePositionRef.current.x,
          y: e.clientY - lastMousePositionRef.current.y,
        };

        const rotationSpeed = 0.01;
        groupRef.current.rotation.y += deltaMove.x * rotationSpeed;
        groupRef.current.rotation.x += deltaMove.y * rotationSpeed;

        lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [scene, isMobile]);

  useFrame((_state, delta) => {
    if (!isMouseDownRef.current && groupRef.current) {
      groupRef.current.rotation.x += (rotationRef.current.x - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (rotationRef.current.y - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.z += (rotationRef.current.z - groupRef.current.rotation.z) * 0.05;
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} scale={1.5}>
      <primitive object={scene} ref={meshRef} />
    </group>
  );
};

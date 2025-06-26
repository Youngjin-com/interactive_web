import React from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';

const App: React.FC = () => {
  return (
    <Canvas shadows style={{ width: '100vw', height: '100vh' }}>
      <Scene />
    </Canvas>
  );
};

export default App;

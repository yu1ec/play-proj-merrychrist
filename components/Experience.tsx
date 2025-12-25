
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera, 
  ContactShadows
} from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import TreeCore from './ChristmasTree/TreeCore';
import { useGestureStore } from '../store/useGestureStore';

const HandControlledCamera = () => {
  const handData = useGestureStore(state => state.handData);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (handData.confidence > 0.5) {
      // Map hand movement to camera offset
      const targetX = (handData.x - 0.5) * 8;
      const targetY = (0.5 - handData.y) * 4 + 4;
      
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
      state.camera.lookAt(0, 0, 0);
    }
  });

  return null;
};

const Experience: React.FC = () => {
  return (
    <Canvas
      shadows
      gl={{ antialias: false, stencil: false, alpha: false }}
    >
      <color attach="background" args={['#01120a']} />
      
      <PerspectiveCamera makeDefault position={[0, 4, 20]} fov={45} />
      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        maxDistance={40} 
        minDistance={10} 
        target={[0, 2, 0]}
        makeDefault
      />

      <ambientLight intensity={0.4} />
      <spotLight 
        position={[10, 20, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={2} 
        castShadow 
        color="#D4AF37"
      />
      <pointLight position={[-10, 5, -10]} intensity={1} color="#043927" />

      {/* Main Christmas Tree Logic */}
      <TreeCore />

      {/* Decorative Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#000805" metalness={0.8} roughness={0.2} />
      </mesh>
      
      <ContactShadows 
        opacity={0.4} 
        scale={20} 
        blur={2} 
        far={10} 
        resolution={256} 
        color="#000000" 
      />

      <Environment preset="lobby" background={false} />

      <HandControlledCamera />

      {/* Post-processing for cinematic look */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.8} 
          mipmapBlur 
          intensity={1.2} 
          radius={0.4} 
        />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
};

export default Experience;


import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Foliage } from './Foliage';
import { Ornaments } from './Ornaments';
import { Polaroids } from './Polaroids';
import { useGestureStore } from '../../store/useGestureStore';
import { TreeState } from '../../types';

const TreeCore: React.FC = () => {
  const treeState = useGestureStore(state => state.treeState);
  const progressRef = useRef(0);

  useFrame((_, delta) => {
    const targetProgress = treeState === TreeState.FORMED ? 1 : 0;
    progressRef.current = THREE.MathUtils.lerp(progressRef.current, targetProgress, delta * 2);
  });

  return (
    <group>
      {/* 5000+ Needles as particles */}
      <Foliage progressRef={progressRef} count={8000} />
      
      {/* Luxury Ornaments: Balls, Gifts, Lights */}
      <Ornaments progressRef={progressRef} />
      
      {/* Polaroid Memories */}
      <Polaroids progressRef={progressRef} count={20} />

      {/* Tree trunk - steady */}
      <mesh position={[0, -4.5, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 2]} />
        <meshStandardMaterial color="#2d1c0b" metalness={0.5} roughness={0.8} />
      </mesh>
    </group>
  );
};

export default TreeCore;

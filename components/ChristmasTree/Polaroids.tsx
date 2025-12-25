
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { generateChaosPosition, generateTreePosition } from '../../utils/math';

interface PolaroidsProps {
  progressRef: React.MutableRefObject<number>;
  count: number;
}

export const Polaroids: React.FC<PolaroidsProps> = ({ progressRef, count }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const data = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const tp = generateTreePosition(12, 4.2);
      // Ensure polaroids face outwards
      const angle = Math.atan2(tp[2], tp[0]);
      
      return {
        chaos: generateChaosPosition(30),
        target: tp,
        rotation: new THREE.Euler(0, -angle + Math.PI/2, (Math.random() - 0.5) * 0.4),
        weight: 0.8 + Math.random() * 1.2,
        // Using picsum for mock photos
        id: Math.floor(Math.random() * 100)
      };
    });
  }, [count]);

  const tempMatrix = new THREE.Matrix4();
  const tempPos = new THREE.Vector3();
  const tempRot = new THREE.Quaternion();
  const tempScale = new THREE.Vector3(0.8, 1, 0.05);

  useFrame(() => {
    if (!meshRef.current) return;
    const p = progressRef.current;

    data.forEach((d, i) => {
      const localP = THREE.MathUtils.clamp(p * d.weight, 0, 1);
      tempPos.set(
        THREE.MathUtils.lerp(d.chaos[0], d.target[0], localP),
        THREE.MathUtils.lerp(d.chaos[1], d.target[1], localP),
        THREE.MathUtils.lerp(d.chaos[2], d.target[2], localP)
      );
      
      // Interpolate rotation: random chaos rotation to clean target rotation
      const chaosRot = new THREE.Quaternion().setFromEuler(new THREE.Euler(d.chaos[0], d.chaos[1], d.chaos[2]));
      const targetRot = new THREE.Quaternion().setFromEuler(d.rotation);
      tempRot.slerpQuaternions(chaosRot, targetRot, localP);

      tempMatrix.compose(tempPos, tempRot, tempScale);
      meshRef.current!.setMatrixAt(i, tempMatrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      {/* Layered materials: [right, left, top, bottom, front, back] */}
      {/* Front is the photo, back is white card */}
      <meshStandardMaterial attach="material-0" color="white" />
      <meshStandardMaterial attach="material-1" color="white" />
      <meshStandardMaterial attach="material-2" color="white" />
      <meshStandardMaterial attach="material-3" color="white" />
      <meshStandardMaterial attach="material-4" color="#f0f0f0" roughness={0.5} />
      <meshStandardMaterial attach="material-5" color="white" />
    </instancedMesh>
  );
};


import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { generateChaosPosition, generateTreePosition } from '../../utils/math';

interface OrnamentsProps {
  progressRef: React.MutableRefObject<number>;
}

const GOLD_COLOR = new THREE.Color('#D4AF37').convertSRGBToLinear();
const EMERALD_COLOR = new THREE.Color('#043927').convertSRGBToLinear();
const RED_COLOR = new THREE.Color('#8b0000').convertSRGBToLinear();

export const Ornaments: React.FC<OrnamentsProps> = ({ progressRef }) => {
  const ballCount = 120;
  const giftCount = 40;
  const ballMesh = useRef<THREE.InstancedMesh>(null);
  const giftMesh = useRef<THREE.InstancedMesh>(null);

  const ballData = useMemo(() => {
    return Array.from({ length: ballCount }, (_, i) => ({
      chaos: generateChaosPosition(22),
      target: generateTreePosition(12, 4.5),
      size: 0.1 + Math.random() * 0.2,
      color: Math.random() > 0.5 ? GOLD_COLOR : (Math.random() > 0.5 ? EMERALD_COLOR : RED_COLOR),
      weight: 0.5 + Math.random() * 1.5,
      rotation: new THREE.Euler(Math.random(), Math.random(), Math.random())
    }));
  }, []);

  const giftData = useMemo(() => {
    return Array.from({ length: giftCount }, (_, i) => ({
      chaos: generateChaosPosition(25),
      target: generateTreePosition(2, 5.5), // Mostly at base
      size: 0.3 + Math.random() * 0.4,
      color: Math.random() > 0.5 ? GOLD_COLOR : RED_COLOR,
      weight: 2.0 + Math.random(),
      rotation: new THREE.Euler(0, Math.random() * Math.PI, 0)
    }));
  }, []);

  const tempMatrix = new THREE.Matrix4();
  const tempPos = new THREE.Vector3();
  const tempRot = new THREE.Quaternion();
  const tempScale = new THREE.Vector3();

  useFrame(() => {
    const p = progressRef.current;

    // Update Balls
    if (ballMesh.current) {
      ballData.forEach((data, i) => {
        // Individualized progress for "organic" clustering
        const localP = THREE.MathUtils.clamp(p * data.weight, 0, 1);
        tempPos.set(
          THREE.MathUtils.lerp(data.chaos[0], data.target[0], localP),
          THREE.MathUtils.lerp(data.chaos[1], data.target[1], localP),
          THREE.MathUtils.lerp(data.chaos[2], data.target[2], localP)
        );
        tempScale.setScalar(data.size);
        tempRot.setFromEuler(data.rotation);
        tempMatrix.compose(tempPos, tempRot, tempScale);
        ballMesh.current!.setMatrixAt(i, tempMatrix);
        ballMesh.current!.setColorAt(i, data.color);
      });
      ballMesh.current.instanceMatrix.needsUpdate = true;
      if (ballMesh.current.instanceColor) ballMesh.current.instanceColor.needsUpdate = true;
    }

    // Update Gifts
    if (giftMesh.current) {
      giftData.forEach((data, i) => {
        const localP = THREE.MathUtils.clamp(p * (data.weight * 0.5), 0, 1);
        tempPos.set(
          THREE.MathUtils.lerp(data.chaos[0], data.target[0], localP),
          THREE.MathUtils.lerp(data.chaos[1], data.target[1], localP),
          THREE.MathUtils.lerp(data.chaos[2], data.target[2], localP)
        );
        tempScale.setScalar(data.size);
        tempRot.setFromEuler(data.rotation);
        tempMatrix.compose(tempPos, tempRot, tempScale);
        giftMesh.current!.setMatrixAt(i, tempMatrix);
        giftMesh.current!.setColorAt(i, data.color);
      });
      giftMesh.current.instanceMatrix.needsUpdate = true;
      if (giftMesh.current.instanceColor) giftMesh.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <>
      <instancedMesh ref={ballMesh} args={[undefined, undefined, ballCount]} castShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial metalness={1.0} roughness={0.1} />
      </instancedMesh>

      <instancedMesh ref={giftMesh} args={[undefined, undefined, giftCount]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial metalness={0.8} roughness={0.3} />
      </instancedMesh>
    </>
  );
};

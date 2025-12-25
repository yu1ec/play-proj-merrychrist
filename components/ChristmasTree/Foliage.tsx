
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { generateChaosPosition, generateTreePosition } from '../../utils/math';

interface FoliageProps {
  progressRef: React.MutableRefObject<number>;
  count: number;
}

const vertexShader = `
  uniform float uProgress;
  uniform float uTime;
  attribute vec3 chaosPos;
  attribute vec3 targetPos;
  attribute float weight;
  varying vec3 vColor;

  void main() {
    // Smooth interpolation with individual weights for a organic feel
    float p = clamp(uProgress * (1.0 + weight * 0.2), 0.0, 1.0);
    vec3 pos = mix(chaosPos, targetPos, p);
    
    // Slight sway in wind
    pos.x += sin(uTime + pos.y) * 0.05 * (1.0 - uProgress);
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (25.0 / -mvPosition.z) * (1.0 + weight);
    gl_Position = projectionMatrix * mvPosition;
    
    // Emerald green palette
    vColor = mix(vec3(0.015, 0.22, 0.15), vec3(0.05, 0.45, 0.25), weight);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export const Foliage: React.FC<FoliageProps> = ({ progressRef, count }) => {
  const meshRef = useRef<THREE.Points>(null);

  const attributes = useMemo(() => {
    const chaosPos = new Float32Array(count * 3);
    const targetPos = new Float32Array(count * 3);
    const weights = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const cp = generateChaosPosition(20);
      const tp = generateTreePosition(14, 5);
      
      chaosPos.set(cp, i * 3);
      targetPos.set(tp, i * 3);
      weights[i] = Math.random();
    }

    return { chaosPos, targetPos, weights };
  }, [count]);

  const uniforms = useMemo(() => ({
    uProgress: { value: 1.0 },
    uTime: { value: 0 }
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uProgress.value = progressRef.current;
      mat.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={attributes.targetPos} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-chaosPos" 
          count={count} 
          array={attributes.chaosPos} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-targetPos" 
          count={count} 
          array={attributes.targetPos} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-weight" 
          count={count} 
          array={attributes.weights} 
          itemSize={1} 
        />
      </bufferGeometry>
      <shaderMaterial 
        transparent 
        depthWrite={false}
        vertexShader={vertexShader} 
        fragmentShader={fragmentShader} 
        uniforms={uniforms}
      />
    </points>
  );
};

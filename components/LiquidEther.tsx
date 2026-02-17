import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Color } from 'three';

const FragmentShader = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;

// Simplex noise function (simplified)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  
  // Slow movement
  float time = uTime * 0.15;
  
  // Create liquid distortion
  float noise1 = snoise(uv * 3.0 + time);
  float noise2 = snoise(uv * 1.5 - time * 0.5);
  
  float dist = noise1 * 0.5 + noise2 * 0.5;
  
  // Mix colors based on distortion
  vec3 color = mix(uColor1, uColor2, dist * 0.5 + 0.5);
  
  // Add subtle white highlights
  float highlight = smoothstep(0.4, 0.6, dist);
  color += vec3(1.0) * highlight * 0.1;
  
  gl_FragColor = vec4(color, 1.0);
}
`;

const VertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FluidPlane: React.FC = () => {
  const meshRef = useRef<any>(null);
  const uniforms = useRef({
    uTime: { value: 0 },
    uColor1: { value: new Color('#e0e7ff') }, // Pale indigo/blue
    uColor2: { value: new Color('#f1f5f9') }, // Slate 100
  });

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[10, 10]} />
      <shaderMaterial
        vertexShader={VertexShader}
        fragmentShader={FragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  );
};

const LiquidEther: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 2] }}>
        <FluidPlane />
      </Canvas>
    </div>
  );
};

export default LiquidEther;
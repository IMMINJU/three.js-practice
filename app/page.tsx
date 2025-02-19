"use client";

import { Suspense, useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ScrollControls,
  Scroll,
  Points,
  PointMaterial,
} from "@react-three/drei";
import * as THREE from "three";

interface BackgroundProps {
  particleCount?: number;
  color?: string;
}

function Background({
  particleCount = 5000,
  color = "#00bcd4",
}: BackgroundProps) {
  const ref = useRef<THREE.Points>(null!);
  const { mouse, viewport } = useThree();

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 10;
      pos[i3 + 1] = (Math.random() - 0.5) * 10;
      pos[i3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [particleCount]);

  const updateParticles = useCallback(
    (delta: number) => {
      if (ref.current) {
        ref.current.rotation.x -= delta / 20;
        ref.current.rotation.y -= delta / 30;

        const positionAttribute = ref.current.geometry.getAttribute(
          "position"
        ) as THREE.BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const x = positionAttribute.array[i3];
          const y = positionAttribute.array[i3 + 1];

          const mouseX = (mouse.x * viewport.width) / 2;
          const mouseY = (mouse.y * viewport.height) / 2;

          positionAttribute.array[i3] = THREE.MathUtils.lerp(
            x,
            x + mouseX / 100,
            0.1
          );
          positionAttribute.array[i3 + 1] = THREE.MathUtils.lerp(
            y,
            y - mouseY / 100,
            0.1
          );
        }
        positionAttribute.needsUpdate = true;
      }
    },
    [mouse, viewport, particleCount]
  );

  useFrame((_, delta) => updateParticles(delta));

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={color}
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function Home() {
  return (
    <div className="w-full h-screen bg-[#1a237e]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Suspense fallback={null}>
          <ScrollControls pages={3} damping={0.25}>
            <Background />
            <Scroll html>
              <div className="w-full h-full">
                <div className="h-screen flex items-center justify-center">
                  <h1 className="text-4xl md:text-6xl text-white font-bold">
                    Welcome to Our 3D World
                  </h1>
                </div>
                <div className="h-screen flex items-center justify-center">
                  <h2 className="text-2xl md:text-4xl text-white">
                    Scroll to Explore
                  </h2>
                </div>
                <div className="h-screen flex items-center justify-center">
                  <h2 className="text-2xl md:text-4xl text-white">
                    Amazing 3D Experience
                  </h2>
                </div>
              </div>
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
}

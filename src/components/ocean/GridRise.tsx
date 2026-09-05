import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Environment } from "@react-three/drei";

type GridRiseProps = {
  gridSize?: number;
  spacing?: number;
  boxSize?: number;
  baseHeight?: number;
  waveStrength?: number;
  waveSpeed?: number;
  ambientColor?: string;
  boxColor?: string;
  transparent?: boolean;
  cameraPos?: [number, number, number];
};

// Reusable dummy object for instance matrix calculations
const dummy = new THREE.Object3D();

function InstancedGrid({
  gridSize = 25,
  spacing = 1.1,
  boxSize = 1.0,
  baseHeight = 2.0,
  waveStrength = 2.0,
  waveSpeed = 1.2,
  boxColor = "#a668db",
  isVisibleRef,
}: GridRiseProps & { isVisibleRef: React.MutableRefObject<boolean> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Pre-calculate positions to center the grid
  const particles = useMemo(() => {
    const temp = [];
    const offset = (gridSize * spacing) / 2 - spacing / 2;
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const posX = x * spacing - offset;
        const posZ = z * spacing - offset;
        temp.push({ x: posX, z: posZ });
      }
    }
    return temp;
  }, [gridSize, spacing]);

  // Array to hold the physics state of each cube's hover lift
  const lifts = useMemo(() => new Float32Array(gridSize * gridSize), [gridSize]);

  // Raycasting plane at y=0 to detect mouse world coordinates
  const { pointer, camera, raycaster } = useThree();
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const mousePos = useMemo(() => new THREE.Vector3(9999, 0, 9999), []);

  // Pre-instantiated reusable colors for per-instance hover highlights (Light blue base, Darker blue hover)
  const baseColorObj = useMemo(() => new THREE.Color(boxColor), [boxColor]);
  const highlightColorObj = useMemo(() => new THREE.Color("#0284c7"), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    if (!meshRef.current || !isVisibleRef.current) return;

    // Calculate world position of mouse
    raycaster.setFromCamera(pointer, camera);
    raycaster.ray.intersectPlane(plane, mousePos);

    const time = state.clock.getElapsedTime() * waveSpeed;

    particles.forEach((particle, i) => {
      // Calculate distance from center for a radial wave effect
      const dist = Math.sqrt(particle.x * particle.x + particle.z * particle.z);

      // Calculate geometric distance from the physical mouse pointer!
      const dx = particle.x - mousePos.x;
      const dz = particle.z - mousePos.z;
      const mouseDist = Math.sqrt(dx * dx + dz * dz);

      let targetLift = 0;
      if (mouseDist < 6.5) {
        targetLift = (6.5 - mouseDist) * 1.6;
      }

      lifts[i] += (targetLift - lifts[i]) * 0.1;
      const hoverLift = lifts[i];

      // Complex wave: radial + moving along X/Z axis + noise
      const heightOffset =
        Math.sin(dist * 0.5 - time) * waveStrength * 0.5 +
        Math.sin(particle.x * 0.4 + time * 0.8) * Math.cos(particle.z * 0.4 + time * 0.6) * waveStrength * 0.5;

      const finalHeight = Math.max(0.1, baseHeight + heightOffset + hoverLift);

      // Set position and scale (keeping original box size and dimensions intact)
      dummy.position.set(particle.x, finalHeight / 2 - 2, particle.z);
      dummy.scale.set(boxSize, finalHeight, boxSize);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);

      // Dynamic hover color boost: strong transition to vibrant ice blue (#00f5d4) for hovered group
      const colorBlend = Math.min(1, hoverLift / 2.5);
      tempColor.copy(baseColorObj).lerp(highlightColorObj, colorBlend);
      meshRef.current!.setColorAt(i, tempColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, gridSize * gridSize]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      {/* We use MeshStandardMaterial without flat shading so edges catch light perfectly like the image */}
      <meshStandardMaterial
        color={boxColor}
        roughness={0.4}
        metalness={0.1}
        envMapIntensity={0.5}
      />
    </instancedMesh>
  );
}

export default function GridRise({
  gridSize = 26,
  spacing = 1.05,
  boxSize = 1.0,
  baseHeight = 2.5,
  waveStrength = 2.5,
  waveSpeed = 1.5,
  ambientColor = "#000000",
  boxColor = "#a875d6",
  transparent = false,
  cameraPos = [20, 15, 20]
}: GridRiseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      isVisibleRef.current = entries[0].isIntersecting;
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 w-full h-full ${transparent ? "" : "bg-black"}`}>
      <Canvas
        camera={{ position: cameraPos, fov: 28 }}
        gl={{ antialias: true, alpha: transparent, powerPreference: "high-performance", preserveDrawingBuffer: false }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            "webglcontextlost",
            (event) => {
              event.preventDefault();
            },
            false
          );
        }}
      >
        {!transparent && <color attach="background" args={[ambientColor]} />}
        <fog attach="fog" args={[ambientColor, 10, cameraPos[0] * 2.2]} />

        {/* Calibrated lighting for rich contrast and depth */}
        <ambientLight intensity={transparent ? 2.5 : 0.85} />
        <directionalLight
          position={[10, 20, 5]}
          intensity={transparent ? 3.5 : 1.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight
          position={[-10, 10, -10]}
          intensity={transparent ? 2.0 : 0.8}
          color="#e0f2fe"
        />

        <InstancedGrid
          gridSize={gridSize}
          spacing={spacing}
          boxSize={boxSize}
          baseHeight={baseHeight}
          waveStrength={waveStrength}
          waveSpeed={waveSpeed}
          boxColor={boxColor}
          isVisibleRef={isVisibleRef}
        />
      </Canvas>
    </div>
  );
}

import React, { useMemo, useRef, useLayoutEffect, useState } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Stars, Cloud, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// --- Constants & Utils ---
const GRID_SIZE = 3; // 3 meters per tile

// Deterministic pseudo-random
const hash = (x: number, z: number) => {
  return Math.abs(Math.sin(x * 12.9898 + z * 78.233) * 43758.5453) % 1;
};

// Height Function: Shared between Terrain geometry and Grid snapping logic
const getTerrainHeight = (x: number, z: number) => {
    // Base rolling hills
    const scale = 0.15;
    const base = Math.sin(x * scale) * 2.5 + Math.cos(z * scale) * 2.5;
    
    // Higher frequency noise
    const detail = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 0.8;
    
    // Small micro-bumps (using our hash)
    const bump = hash(Math.floor(x), Math.floor(z)) * 0.3;

    // Center clearing flattening
    const dist = Math.sqrt(x * x + z * z);
    const flatFactor = Math.min(1, Math.max(0, (dist - 8) / 12)); 

    return (base + detail + bump) * flatFactor;
};

// Check if a position is valid for building
const checkZoneValidity = (x: number, z: number) => {
    const h = getTerrainHeight(x, z);
    
    // 1. Swamp check (Too low)
    if (h < -1.5) return { valid: false, reason: 'SWAMP' };

    // 2. Cliff check (Slope too steep)
    // Sample neighbors
    const h_right = getTerrainHeight(x + GRID_SIZE, z);
    const h_fwd = getTerrainHeight(x, z + GRID_SIZE);
    const slopeX = Math.abs(h - h_right);
    const slopeZ = Math.abs(h - h_fwd);
    
    if (slopeX > 1.2 || slopeZ > 1.2) return { valid: false, reason: 'CLIFF' };

    return { valid: true, reason: 'OK' };
};


// --- Components ---

// 1. Irregular Red Clay Ground
const Terrain: React.FC<{ onHover?: (p: THREE.Vector3) => void }> = ({ onHover }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    const geometry = meshRef.current.geometry;
    const positionAttribute = geometry.getAttribute('position');
    const vertex = new THREE.Vector3();

    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(positionAttribute, i);
      // Important: Plane is rotated -PI/2 on X.
      // Local coords: x=x, y=y, z=0.
      // World coords after rotation: x=x, y=0, z=y (inverted/flipped).
      // We need to be consistent with getTerrainHeight(x, z).
      // When rotated: World X = Local X. World Z = -Local Y.
      
      const worldX = vertex.x;
      const worldZ = -vertex.y; // Because PlaneGeometry is X,Y and we rotate X by -90deg
      
      const height = getTerrainHeight(worldX, worldZ);
      positionAttribute.setZ(i, height);
    }
    
    geometry.computeVertexNormals();
    positionAttribute.needsUpdate = true;
  }, []);

  return (
    <mesh 
        ref={meshRef} 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
        onPointerMove={(e) => {
            e.stopPropagation();
            if (onHover) onHover(e.point);
        }}
    >
      {/* 80x80 grid size implies roughly 240x240 meters if 3m tiles. Let's stick to 100x100 area for now but increase segments for smoothness */}
      <planeGeometry args={[100, 100, 100, 100]} />
      <meshStandardMaterial 
        color="#8B4513" // Reddish clay
        roughness={0.9}
        metalness={0.1}
        flatShading={false}
      />
    </mesh>
  );
};

// 2. Placement Ghost Cursor
const PlacementGhost: React.FC<{ position: THREE.Vector3 | null, visible: boolean }> = ({ position, visible }) => {
    if (!visible || !position) return null;

    // Snap Logic
    const snapX = Math.round(position.x / GRID_SIZE) * GRID_SIZE;
    const snapZ = Math.round(position.z / GRID_SIZE) * GRID_SIZE;
    const snapY = getTerrainHeight(snapX, snapZ);
    
    const { valid } = checkZoneValidity(snapX, snapZ);
    const color = valid ? "#4ade80" : "#ef4444"; // Green or Red

    return (
        <group position={[snapX, snapY, snapZ]}>
            {/* The Box Ghost */}
            <mesh position={[0, 1.5, 0]}> {/* Floating slightly */}
                <boxGeometry args={[GRID_SIZE * 0.9, 0.5, GRID_SIZE * 0.9]} />
                <meshBasicMaterial color={color} transparent opacity={0.4} wireframe />
            </mesh>
            {/* Solid inner core */}
            <mesh position={[0, 1.5, 0]}>
                <boxGeometry args={[GRID_SIZE * 0.8, 0.4, GRID_SIZE * 0.8]} />
                <meshBasicMaterial color={color} transparent opacity={0.2} />
            </mesh>
            {/* Connection Line to ground */}
            <line>
                <bufferGeometry attach="geometry">
                   <float32BufferAttribute attach="attributes-position" count={2} array={new Float32Array([0, 0, 0, 0, 5, 0])} itemSize={3} />
                </bufferGeometry>
                <lineBasicMaterial attach="material" color={color} />
            </line>
        </group>
    );
}


// 3. Procedural Tree Component
const AncientTree: React.FC<{ position: [number, number, number], scale: number }> = ({ position, scale }) => {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.4, 4, 6]} />
        <meshStandardMaterial color="#3e2723" roughness={1} />
      </mesh>
      <mesh position={[0, 4, 0]} castShadow>
        <coneGeometry args={[2.5, 2, 7]} />
        <meshStandardMaterial color="#1b4d2e" roughness={0.8} />
      </mesh>
      <mesh position={[0, 5, 0]} castShadow>
        <coneGeometry args={[2, 2, 7]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.8} />
      </mesh>
      <mesh position={[0, 6, 0]} castShadow>
        <coneGeometry args={[1.5, 2, 7]} />
        <meshStandardMaterial color="#4caf50" roughness={0.8} />
      </mesh>
    </group>
  );
};

// 4. Forest Generator
const Forest: React.FC = () => {
  const treeData = useMemo(() => {
    const trees = [];
    const count = 200;
    for (let i = 0; i < count; i++) {
      const angle = hash(i, 0) * Math.PI * 2;
      const radius = 15 + hash(0, i) * 35; 
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      const y = getTerrainHeight(x, z) - 0.5; // Sink slightly
      const scale = 0.8 + hash(i, i) * 0.8;
      trees.push({ position: [x, y, z] as [number, number, number], scale });
    }
    return trees;
  }, []);

  return (
    <group>
      {treeData.map((tree, idx) => (
        <AncientTree key={idx} position={tree.position} scale={tree.scale} />
      ))}
    </group>
  );
};

// 5. Fireflies
const Fireflies: React.FC = () => {
  const count = 50;
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        t: Math.random() * 100,
        factor: 20 + Math.random() * 100,
        speed: 0.01 + Math.random() * 0.05,
        xFactor: -50 + Math.random() * 100,
        yFactor: -50 + Math.random() * 100,
        zFactor: -50 + Math.random() * 100,
        mx: 0, my: 0
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.position.y = Math.abs(dummy.position.y % 10) + 2; 
      
      dummy.scale.setScalar(s * 0.5 + 0.5);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.05, 0]} />
      <meshBasicMaterial color="#ccffcc" transparent opacity={0.6} />
    </instancedMesh>
  );
};

interface MistyIslandSceneProps {
    isCloning: boolean;
}

// --- Main Scene ---
export const MistyIslandScene: React.FC<MistyIslandSceneProps> = ({ isCloning }) => {
  const [hoverPoint, setHoverPoint] = useState<THREE.Vector3 | null>(null);

  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[15, 15, 30]} fov={50} />
      
      {/* Volumetric-ish Fog */}
      <fogExp2 attach="fog" args={['#0f2b1d', 0.025]} />
      <color attach="background" args={['#051105']} />

      {/* Lights */}
      <ambientLight intensity={0.4} color="#aaccff" />
      <directionalLight 
        position={[50, 80, 20]} 
        intensity={1.5} 
        castShadow 
        color="#ffeedd"
        shadow-bias={-0.0005}
      >
        <orthographicCamera attach="shadow-camera" args={[-50, 50, 50, -50]} />
      </directionalLight>

      {/* Camouflaged Grid (Visual Helper at 0) */}
      <gridHelper 
        args={[100, 33, 0x334433, 0x223322]} 
        position={[0, 0.5, 0]} 
        visible={!isCloning} // Hide default grid when cloning to avoid confusion
      />

      {/* World Objects */}
      <Terrain onHover={isCloning ? setHoverPoint : undefined} />
      <Forest />
      <Fireflies />

      {/* Ghost Cursor for Grid Snapping */}
      <PlacementGhost position={hoverPoint} visible={isCloning} />

      {/* Atmosphere */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Cloud opacity={0.3} speed={0.2} width={20} depth={1.5} segments={10} position={[0, 15, -10]} color="#1a2e1a" />
      <Cloud opacity={0.2} speed={0.1} width={30} depth={2} segments={10} position={[10, 10, 10]} color="#1a2e1a" />

      {/* Controls */}
      <OrbitControls 
        enablePan={true} 
        maxPolarAngle={Math.PI / 2 - 0.1} 
        minDistance={5}
        maxDistance={60}
        autoRotate={!isCloning} // Stop rotation when trying to place
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};
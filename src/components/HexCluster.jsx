import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Fisher-Yates shuffle
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Create flat hexagon geometry (no depth for seamless look)
function createHexagonGeometry() {
  const shape = new THREE.Shape();
  const radius = 2.2;
  
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  shape.closePath();
  
  const geometry = new THREE.ShapeGeometry(shape);
  return geometry;
}

// Generate exactly 24 hexagons in honeycomb pattern
function generate24Hexagons() {
  const positions = [];
  const hexWidth = 3.4;
  const hexHeight = 3.12;
  
  // 4 rows x 6 cols = 24 hexagons
  const rows = 4;
  const cols = 6;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const xOffset = row % 2 === 0 ? 0 : hexWidth / 2;
      const x = col * hexWidth + xOffset - (cols * hexWidth) / 2 + hexWidth / 2;
      const y = row * hexHeight * 0.75 - (rows * hexHeight) / 2 + hexHeight / 2;
      
      positions.push([x, y, 0]);
    }
  }

  return positions;
}

function HexCluster({ projects, isActive }) {
  const meshRef = useRef();
  const backMeshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const positions = useMemo(() => generate24Hexagons(), []);
  const hexCount = 24;
  const geometry = useMemo(() => createHexagonGeometry(), []);
  
  const [flipStates, setFlipStates] = useState(Array(hexCount).fill('idle'));
  const [rotations, setRotations] = useState(Array(hexCount).fill(0));
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Progressive flip scheduler
  useEffect(() => {
    if (!isActive) {
      setFlipStates(Array(hexCount).fill('idle'));
      setRotations(Array(hexCount).fill(0));
      return;
    }

    // Shuffle the flip order
    const flipOrder = shuffleArray(Array.from({ length: hexCount }, (_, i) => i));
    let revealed = 0;

    const interval = setInterval(() => {
      if (revealed >= hexCount) {
        clearInterval(interval);
        return;
      }

      const batchSize = Math.random() > 0.6 ? 2 : 1;
      const batch = flipOrder.slice(revealed, revealed + batchSize);
      
      setFlipStates(prev => {
        const next = [...prev];
        batch.forEach(idx => {
          next[idx] = 'flipping';
        });
        return next;
      });

      revealed += batch.length;
    }, 800); // Slower timing

    return () => clearInterval(interval);
  }, [isActive, hexCount]);

  // Animation frame
  useFrame((state, delta) => {
    if (!meshRef.current || !backMeshRef.current) return;

    const newRotations = [...rotations];
    const newStates = [...flipStates];

    positions.forEach((pos, i) => {
      if (flipStates[i] === 'flipping') {
        newRotations[i] += delta * 1.2;
        if (newRotations[i] >= Math.PI) {
          newRotations[i] = Math.PI;
          newStates[i] = 'revealed';
        }
      }

      const [x, y, z] = pos;
      const hoverScale = hoveredIndex === i ? 1.08 : 1;

      // Front face (white)
      dummy.position.set(x, y, z);
      dummy.rotation.set(0, newRotations[i], 0);
      dummy.scale.set(hoverScale, hoverScale, 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Back face (turquoise)
      dummy.position.set(x, y, z - 0.01);
      dummy.rotation.set(0, newRotations[i] + Math.PI, 0);
      dummy.scale.set(hoverScale, hoverScale, 1);
      dummy.updateMatrix();
      backMeshRef.current.setMatrixAt(i, dummy.matrix);
    });

    setRotations(newRotations);
    setFlipStates(newStates);

    meshRef.current.instanceMatrix.needsUpdate = true;
    backMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!isActive) return null;

  return (
    <group>
      {/* Front faces (white) */}
      <instancedMesh ref={meshRef} args={[geometry, null, hexCount]}>
        <meshBasicMaterial color="#ffffff" side={THREE.FrontSide} />
      </instancedMesh>

      {/* Back faces (turquoise) */}
      <instancedMesh ref={backMeshRef} args={[geometry, null, hexCount]}>
        <meshBasicMaterial color="#5bcbca" side={THREE.FrontSide} />
      </instancedMesh>

      {/* Text labels */}
      {positions.map((pos, i) => {
        const [x, y] = pos;
        const project = projects[i];
        const isRevealed = flipStates[i] === 'revealed';
        const rotation = rotations[i];

        if (!isRevealed || !project) return null;

        return (
          <group
            key={i}
            position={[x, y, 0.02]}
            rotation={[0, rotation + Math.PI, 0]}
            onPointerOver={() => setHoveredIndex(i)}
            onPointerOut={() => setHoveredIndex(null)}
            onClick={() => console.log('Clicked:', project.title)}
          >
            <Text
              fontSize={0.4}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              maxWidth={3}
              textAlign="center"
            >
              {project.title}
            </Text>
            <Text
              position={[0, -0.7, 0]}
              fontSize={0.25}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              opacity={0.85}
            >
              {project.tag}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

export default HexCluster;
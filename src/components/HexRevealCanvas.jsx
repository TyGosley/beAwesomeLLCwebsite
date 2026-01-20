import { Canvas } from '@react-three/fiber';
import HexCluster from './HexCluster';

function HexRevealCanvas({ projects, isActive }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />
        <directionalLight position={[-10, -10, -10]} intensity={0.3} />
        
        <HexCluster projects={projects} isActive={isActive} />
      </Canvas>
    </div>
  );
}

export default HexRevealCanvas;
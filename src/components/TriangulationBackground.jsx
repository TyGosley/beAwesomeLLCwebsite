import triangulationSvg from '../assets/triangulation.svg?raw';
import './TriangulationBackground.css';

function TriangulationBackground({ title = 'BUILD. CREATE. ACCELERATE.', isActive = false }) {
  return (
    <div className={`triangulation-scene${isActive ? ' is-active' : ''}`}>
      <div
        className="triangulation-svg"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: triangulationSvg }}
      />
      <div className="triangulation-title-block">
        <h1 className="triangulation-title">{title}</h1>
      </div>
    </div>
  );
}

export default TriangulationBackground;

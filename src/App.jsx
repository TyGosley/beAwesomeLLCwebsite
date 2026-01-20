import { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import HoneycombBackground from './components/HoneycombBackground';
import { projects } from './content/projects';
import './App.css';

function App() {
  const [isTransformed, setIsTransformed] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);

  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return undefined;

    const updateHeight = () => {
      setHeaderHeight(Math.round(headerEl.getBoundingClientRect().height));
    };

    updateHeight();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }

    const observer = new ResizeObserver(updateHeight);
    observer.observe(headerEl);

    return () => observer.disconnect();
  }, []);

  const handleButtonClick = () => {
    setIsTransformed(!isTransformed); // Toggle for reset functionality
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <HoneycombBackground
        projects={projects}
        isActive={isTransformed}
        onToggle={handleButtonClick}
        showButton={false}
        borderColor="#111111"
        projectBackColor="#5bcbca"
        topOffset={headerHeight}
      />

      {/* Diagonal Spray-Painted Logo */}
      {/* <div className="logo-diagonal">
        <img 
          src="/beawesome-logo.png" 
          alt="Be Awesome Productions"
          className="logo-image-diagonal"
        />
      </div> */}

      <Header
        ref={headerRef}
        onButtonClick={handleButtonClick}
        isTransformed={isTransformed}
        showCTA
      />
      
      <main className="pt-32 px-4 sm:px-8 relative z-10" />
    </div>
  );
}

export default App;

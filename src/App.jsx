import { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import TriangulationBackground from './components/TriangulationBackground';
import './App.css';

// TODO: Re-enable font preview grid when we're ready to compare type options.
// const fontPreviews = [
//   { label: 'aAttackGraffiti', fontFamily: 'aAttackGraffiti' },
//   { label: 'FankyBubbleGraffiti-Line', fontFamily: 'FankyBubbleGraffitiLine' },
//   { label: 'FankyBubbleGraffiti-Regular', fontFamily: 'FankyBubbleGraffitiRegular' },
//   { label: 'Graffiti_desiderium-Regular', fontFamily: 'GraffitiDesiderium' },
//   { label: 'RobinGraffiti', fontFamily: 'RobinGraffiti' },
//   { label: 'RobinGraffitiFilledin', fontFamily: 'RobinGraffitiFilledIn' },
//   { label: 'Streetfunk Graffiti PERSONAL USE ONLY', fontFamily: 'StreetfunkGraffiti' },
//   { label: 'Vandal Blow Shadow', fontFamily: 'VandalBlowShadow' },
//   { label: 'Vandal Blow Solid', fontFamily: 'VandalBlowSolid' },
//   { label: 'Vandalust', fontFamily: 'Vandalust' },
//   { label: 'Amsterdam', fontFamily: 'Amsterdam' },
// ];

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
      <TriangulationBackground isActive={isTransformed} />

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

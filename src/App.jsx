import { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import HoneycombBackground from './components/HoneycombBackground';
import { projects } from './content/projects';
import './App.css';

const fontPreviews = [
  { label: 'aAttackGraffiti', fontFamily: 'aAttackGraffiti' },
  { label: 'FankyBubbleGraffiti-Extrude', fontFamily: 'FankyBubbleGraffitiExtrude' },
  { label: 'FankyBubbleGraffiti-Line', fontFamily: 'FankyBubbleGraffitiLine' },
  { label: 'FankyBubbleGraffiti-Regular', fontFamily: 'FankyBubbleGraffitiRegular' },
  { label: 'Graffiti_desiderium-Regular', fontFamily: 'GraffitiDesiderium' },
  { label: 'RobinGraffiti', fontFamily: 'RobinGraffiti' },
  { label: 'RobinGraffitiFilledin', fontFamily: 'RobinGraffitiFilledIn' },
  { label: 'Streetfunk Graffiti PERSONAL USE ONLY', fontFamily: 'StreetfunkGraffiti' },
  { label: 'Vandal Blow Inner', fontFamily: 'VandalBlowInner' },
  { label: 'Vandal Blow Shadow', fontFamily: 'VandalBlowShadow' },
  { label: 'Vandal Blow Solid', fontFamily: 'VandalBlowSolid' },
  { label: 'Vandalust', fontFamily: 'Vandalust' },
  { label: 'Amsterdam', fontFamily: 'Amsterdam' },
];

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
        title="Be Awesome Productions"
        titleColor="#5bcbca"
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
      
      <main className="pt-32 px-4 sm:px-8 relative z-10">
        <section className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fontPreviews.map(font => (
              <div
                key={font.fontFamily}
                className="rounded-2xl border-2 border-black bg-white/90 p-4 shadow-lg"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {font.label}
                </div>
                <div
                  className="mt-2 text-center text-2xl sm:text-3xl"
                  style={{ fontFamily: font.fontFamily }}
                >
                  Be Awesome Productions
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

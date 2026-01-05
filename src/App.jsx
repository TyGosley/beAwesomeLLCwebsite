import { useState } from 'react';
import Header from './components/Header';
import './App.css';

function App() {
  const [isTransformed, setIsTransformed] = useState(false);

  const handleButtonClick = () => {
    setIsTransformed(true);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Diagonal Spray-Painted Logo */}
      <div className="logo-diagonal">
        <img 
          src="/beawesome-logo.png" 
          alt="Be Awesome Productions"
          className="logo-image-diagonal"
        />
      </div>

      <Header onButtonClick={handleButtonClick} isTransformed={isTransformed} />
      
      <main className="pt-32 px-4 sm:px-8 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {!isTransformed ? (
            <div className="text-gray-800 text-base sm:text-lg max-w-2xl mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg">
              <p className="text-xl font-semibold mb-2">Welcome to our creative space.</p>
              <p className="mt-4">Click the button above to explore our projects.</p>
            </div>
          ) : (
            <div className="text-gray-800 text-base sm:text-lg max-w-2xl mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg">
              <p className="text-xl font-semibold mb-2">🎉 Background transformation coming soon!</p>
              <p className="mt-4">We'll add the honeycomb effect in the next step.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
import { useState } from 'react';
import Header from './components/Header';
import './App.css';

function App() {
  const [isTransformed, setIsTransformed] = useState(false);

  const handleButtonClick = () => {
    setIsTransformed(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onButtonClick={handleButtonClick} isTransformed={isTransformed} />
      
      <main className="pt-32 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Bubble Graffiti Logo Text */}
          <h1 className="logo-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 px-4">
            Be Awesome Productions
          </h1>
          
          {!isTransformed ? (
            <div className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              <p>Welcome to our creative space.</p>
              <p className="mt-4">Click the button above to explore our projects.</p>
            </div>
          ) : (
            <div className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              <p>🎉 Background transformation coming soon!</p>
              <p className="mt-4">We'll add the honeycomb effect in the next step.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
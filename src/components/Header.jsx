import { useState } from 'react';

function Header({ onButtonClick, isTransformed }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 lg:gap-8">
            <a 
              href="#home" 
              className="text-black uppercase font-semibold text-sm tracking-wide hover:text-gray-600 transition-colors"
            >
              Home
            </a>
            <a 
              href="#projects" 
              className="text-black uppercase font-semibold text-sm tracking-wide hover:text-gray-600 transition-colors"
            >
              Projects
            </a>
            <a 
              href="#contact" 
              className="text-black uppercase font-semibold text-sm tracking-wide hover:text-gray-600 transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-black transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-black transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-black transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>

          {/* Call-to-Action Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline text-sm font-medium text-gray-700 uppercase tracking-wide">
              Explore
            </span>
            <button
              onClick={onButtonClick}
              disabled={isTransformed}
              className={`
                px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold uppercase text-xs sm:text-sm tracking-wide
                transition-all duration-300
                ${isTransformed 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-gray-800 hover:scale-105'
                }
              `}
            >
              {isTransformed ? 'Transformed' : 'Click Here'}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4 border-t pt-4">
            <a 
              href="#home" 
              className="text-black uppercase font-semibold text-sm tracking-wide hover:text-gray-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>
            <a 
              href="#projects" 
              className="text-black uppercase font-semibold text-sm tracking-wide hover:text-gray-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </a>
            <a 
              href="#contact" 
              className="text-black uppercase font-semibold text-sm tracking-wide hover:text-gray-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
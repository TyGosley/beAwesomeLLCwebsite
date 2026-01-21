import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import HexTile from './HexTile';

const HEX_RATIO = Math.sqrt(3) / 2;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function useViewportSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
    };
  }, []);

  return size;
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function createSeededRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

function shuffleWithRng(array, rng) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function assignProjectsToTiles(tileCount, projects, seed) {
  const slots = Array(tileCount).fill(null);
  if (!projects?.length || tileCount === 0) return slots;

  const rng = createSeededRng(seed);
  const indices = shuffleWithRng(
    Array.from({ length: tileCount }, (_, i) => i),
    rng,
  );
  const count = Math.min(projects.length, tileCount);

  for (let i = 0; i < count; i += 1) {
    slots[indices[i]] = projects[i];
  }

  return slots;
}

function buildLayout(viewportWidth, viewportHeight, hexHeight, bleed) {
  if (!viewportWidth || !viewportHeight) {
    return {
      tiles: [],
      hexWidth: 0,
      hexHeight,
      rowHeight: 0,
      cols: 0,
      rows: 0,
      bleed,
      tileWidth: 0,
      tileHeight: 0,
    };
  }

  const hexWidth = Math.round(hexHeight * HEX_RATIO);
  const rowHeight = Math.round(hexHeight * 0.75);
  const tileWidth = hexWidth + bleed;
  const tileHeight = hexHeight + bleed;
  const cols = Math.ceil(viewportWidth / hexWidth) + 1;
  const rows = Math.ceil(viewportHeight / rowHeight) + 1;
  const tiles = [];
  let id = 0;

  for (let row = 0; row < rows; row += 1) {
    const rowOffset = row % 2 ? hexWidth / 2 : 0;
    const y = row * rowHeight;

    for (let col = 0; col < cols; col += 1) {
      const x = col * hexWidth + rowOffset;
      tiles.push({
        id,
        x: Math.round(x),
        y: Math.round(y),
      });
      id += 1;
    }
  }

  const boundedTiles = tiles.filter(tile => (
    tile.x >= 0
    && tile.y >= 0
    && tile.x + tileWidth <= viewportWidth
    && tile.y + tileHeight <= viewportHeight
  ));

  return {
    tiles: boundedTiles,
    hexWidth,
    hexHeight,
    rowHeight,
    cols,
    rows,
    bleed,
    tileWidth,
    tileHeight,
  };
}

function HoneycombBackground({
  projects = [],
  isActive: controlledActive,
  onToggle,
  showButton = true,
  buttonLabel = 'Click Here',
  hexHeight,
  borderColor = '#111111',
  borderWidth,
  frontColor = '#ffffff',
  backColor = '#ffffff',
  projectBackColor = '#5bcbca',
  tileDensity = 0.7,
  maxTiles = 30,
  topOffset = 0,
  title,
  titleColor = '#5bcbca',
  titleClassName = '',
  flipDuration = 0.7,
  flipInterval = 260,
  flipEase = [0.4, 0, 0.2, 1],
  loop = false,
  seed = 'beawesome',
  linkTarget = '_self',
  className = '',
}) {
  const prefersReducedMotion = useReducedMotion();
  const { width, height } = useViewportSize();
  const [internalActive, setInternalActive] = useState(false);
  const isControlled = controlledActive !== undefined;
  const isActive = isControlled ? controlledActive : internalActive;
  const orderRef = useRef([]);
  const orderIndexRef = useRef(0);

  const resolvedHexHeight = useMemo(() => {
    if (hexHeight !== undefined) return Math.round(hexHeight);
    if (!width || !height) return 96;
    return clamp(Math.round(Math.min(width, height) / 6), 64, 128);
  }, [hexHeight, width, height]);

  const resolvedBorderWidth = useMemo(() => {
    if (borderWidth !== undefined) return borderWidth;
    return Math.max(6, Math.round(resolvedHexHeight * 0.08));
  }, [borderWidth, resolvedHexHeight]);

  const bleed = useMemo(
    () => Math.max(1, Math.round(resolvedHexHeight * 0.02)),
    [resolvedHexHeight],
  );

  const availableHeight = useMemo(
    () => Math.max(0, height - topOffset),
    [height, topOffset],
  );

  const layout = useMemo(
    () => buildLayout(width, availableHeight, resolvedHexHeight, bleed),
    [width, availableHeight, resolvedHexHeight, bleed],
  );

  const clampedDensity = useMemo(
    () => clamp(tileDensity, 0, 1),
    [tileDensity],
  );

  const resolvedMaxTiles = useMemo(
    () => Math.max(0, Math.floor(maxTiles)),
    [maxTiles],
  );

  const tilesToRender = useMemo(() => {
    if (!layout.tiles.length || resolvedMaxTiles === 0) return [];

    const maxCount = Math.min(resolvedMaxTiles, layout.tiles.length);
    const minCount = Math.min(projects.length, maxCount);
    const densityCount = Math.round(maxCount * clampedDensity);
    const targetCount = clamp(Math.max(densityCount, minCount), 0, maxCount);

    if (targetCount === 0) return [];

    const rng = createSeededRng(hashString(`${seed}-visible`));
    const shuffled = shuffleWithRng(
      Array.from({ length: layout.tiles.length }, (_, i) => i),
      rng,
    );
    const chosen = shuffled.slice(0, targetCount).sort((a, b) => a - b);

    return chosen.map(index => ({ ...layout.tiles[index], index }));
  }, [
    layout.tiles,
    resolvedMaxTiles,
    clampedDensity,
    projects.length,
    seed,
  ]);

  const tileProjects = useMemo(() => {
    const seedValue = hashString(`${seed}-projects`);
    return assignProjectsToTiles(tilesToRender.length, projects, seedValue);
  }, [tilesToRender.length, projects, seed]);

  const [revealStates, setRevealStates] = useState(
    Array(tilesToRender.length).fill(false),
  );

  const [flipStates, setFlipStates] = useState(
    Array(tilesToRender.length).fill(false),
  );

  useEffect(() => {
    setRevealStates(Array(tilesToRender.length).fill(false));
    setFlipStates(Array(tilesToRender.length).fill(false));
  }, [tilesToRender.length]);

  useEffect(() => {
    if (!isActive) {
      setRevealStates(Array(tilesToRender.length).fill(false));
      setFlipStates(Array(tilesToRender.length).fill(false));
      return undefined;
    }

    if (!tilesToRender.length) {
      return undefined;
    }

    if (prefersReducedMotion) {
      const revealed = Array(tilesToRender.length).fill(true);
      const flipped = Array(tilesToRender.length).fill(false);
      tileProjects.forEach((project, index) => {
        if (project) flipped[index] = true;
      });
      setRevealStates(revealed);
      setFlipStates(flipped);
      return undefined;
    }

    orderRef.current = shuffleWithRng(
      Array.from({ length: tilesToRender.length }, (_, i) => i),
      Math.random,
    );
    orderIndexRef.current = 0;
    setRevealStates(Array(tilesToRender.length).fill(false));
    setFlipStates(Array(tilesToRender.length).fill(false));

    const interval = setInterval(() => {
      const batchSize = Math.random() > 0.6 ? 2 : 1;
      const batch = [];

      while (batch.length < batchSize) {
        if (orderIndexRef.current >= orderRef.current.length) {
          if (!loop) {
            clearInterval(interval);
            break;
          }

          orderRef.current = shuffleWithRng(
            Array.from({ length: tilesToRender.length }, (_, i) => i),
            Math.random,
          );
          orderIndexRef.current = 0;
          setRevealStates(Array(tilesToRender.length).fill(false));
          setFlipStates(Array(tilesToRender.length).fill(false));
        }

        if (!orderRef.current.length) break;

        const nextIndex = orderRef.current[orderIndexRef.current];
        orderIndexRef.current += 1;
        batch.push(nextIndex);
      }

      if (!batch.length) return;

      setRevealStates(prev => {
        const next = [...prev];
        batch.forEach(index => {
          next[index] = true;
        });
        return next;
      });

      setFlipStates(prev => {
        const next = [...prev];
        batch.forEach(index => {
          if (tileProjects[index]) next[index] = true;
        });
        return next;
      });
    }, flipInterval);

    return () => clearInterval(interval);
  }, [
    isActive,
    tilesToRender.length,
    flipInterval,
    loop,
    prefersReducedMotion,
    tileProjects,
  ]);

  const handleToggle = () => {
    if (isControlled) {
      onToggle?.(!isActive);
      return;
    }

    setInternalActive(prev => !prev);
    onToggle?.(!isActive);
  };

  const tileWidth = layout.tileWidth;
  const tileHeight = layout.tileHeight;

  return (
    <div
      className={`fixed left-0 right-0 z-0 overflow-hidden bg-white ${className}`}
      style={{
        top: topOffset,
        height: availableHeight,
      }}
    >
      {showButton && !isActive && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <motion.button
            type="button"
            onClick={handleToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-lg border-8 border-black bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-black shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            aria-pressed={isActive}
          >
            {buttonLabel}
          </motion.button>
        </div>
      )}

      {title ? (
        <div className="absolute inset-0 z-0 flex items-center justify-center px-6 text-center pointer-events-none">
          <h1
            className={`honeycomb-title ${titleClassName}`}
            style={{ color: titleColor }}
          >
            {title}
          </h1>
        </div>
      ) : null}

      <motion.div
        className="absolute inset-0 z-10"
        initial={false}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
        style={{ pointerEvents: isActive ? 'auto' : 'none' }}
        aria-hidden={!isActive}
      >
        <div className="relative h-full w-full" style={{ perspective: '1200px' }}>
          {tilesToRender.map((tile, index) => (
            <HexTile
              key={tile.id}
              x={tile.x}
              y={tile.y}
              width={tileWidth}
              height={tileHeight}
              borderWidth={resolvedBorderWidth}
              borderColor={borderColor}
              frontColor={frontColor}
              backColor={backColor}
              projectBackColor={projectBackColor}
              project={tileProjects[index]}
              isVisible={revealStates[index]}
              isFlipped={flipStates[index]}
              reducedMotion={prefersReducedMotion}
              flipDuration={flipDuration}
              flipEase={flipEase}
              linkTarget={linkTarget}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default HoneycombBackground;

import { motion } from 'framer-motion';

function HexTile({
  x,
  y,
  width,
  height,
  borderWidth,
  borderColor,
  frontColor,
  backColor,
  projectBackColor,
  project,
  isVisible = true,
  isFlipped,
  reducedMotion,
  flipDuration = 0.7,
  flipEase = [0.4, 0, 0.2, 1],
  linkTarget = '_self',
}) {
  const hasProject = Boolean(project && project.href);
  const target = project?.target || linkTarget;
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined;
  const backFill = hasProject ? projectBackColor : backColor;
  const rotateY = reducedMotion ? 0 : isFlipped ? 180 : 0;
  const fadeTransition = reducedMotion
    ? { duration: 0.25, ease: 'easeOut' }
    : { duration: 0 };
  const revealTransition = { duration: 0.25, ease: 'easeOut' };

  return (
    <motion.div
      className="hex-tile"
      style={{
        width,
        height,
        left: x,
        top: y,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      animate={{ rotateY, opacity: isVisible ? 1 : 0 }}
      transition={{
        rotateY: { duration: reducedMotion ? 0 : flipDuration, ease: flipEase },
        opacity: revealTransition,
      }}
    >
      <div className="hex-3d">
        <motion.div
          className="hex-face hex-clip"
          style={{
            backgroundColor: borderColor,
            '--hex-border': `${borderWidth}px`,
            pointerEvents: 'none',
          }}
          animate={{ opacity: reducedMotion && isFlipped ? 0 : 1 }}
          transition={fadeTransition}
        >
          <div
            className="hex-inner hex-clip"
            style={{ backgroundColor: frontColor }}
          />
        </motion.div>

        <motion.div
          className="hex-face hex-clip"
          style={{
            backgroundColor: borderColor,
            '--hex-border': `${borderWidth}px`,
            transform: reducedMotion ? 'none' : 'rotateY(180deg)',
            pointerEvents: isFlipped && hasProject ? 'auto' : 'none',
          }}
          animate={{ opacity: reducedMotion && !isFlipped ? 0 : 1 }}
          transition={fadeTransition}
        >
          <div
            className="hex-inner hex-clip"
            style={{ backgroundColor: backFill }}
          >
            {hasProject ? (
              <a
                href={project.href}
                target={target}
                rel={rel}
                tabIndex={isFlipped ? 0 : -1}
                aria-hidden={!isFlipped}
                aria-label={`${project.title} ${project.tag || ''}`.trim()}
                className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center text-[11px] font-black uppercase leading-tight tracking-wide text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                <span>{project.title}</span>
                {project.tag ? (
                  <span className="text-[10px] font-semibold normal-case opacity-80">
                    {project.tag}
                  </span>
                ) : null}
              </a>
            ) : null}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default HexTile;

function ReducedMotionFallback({ projects, isVisible }) {
  if (!isVisible) return null;

  const displayProjects = projects.slice(0, 20);

  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center p-8 overflow-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl w-full">
        {displayProjects.map((project) => (
          <div
            key={project.id}
            className="bg-turquoise-400 p-6 rounded-lg shadow-lg text-center transform transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: '#5bcbca' }}
          >
            <h3 className="font-bold text-white text-lg mb-2">
              {project.title}
            </h3>
            <p className="text-white text-sm opacity-80">
              {project.tag}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReducedMotionFallback;
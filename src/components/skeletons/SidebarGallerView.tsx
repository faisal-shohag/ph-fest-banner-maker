
const SidebarGallerView = () => {
  return (
       <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square animate-pulse"
            />
          ))}
        </div>
      </div>
  );
};

export default SidebarGallerView;
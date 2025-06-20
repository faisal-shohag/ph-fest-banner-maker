
const Heading = ({Icon, title, subtitle }) => {
    return (
         <div className="flex items-center gap-2 mb-6">
        <div>
          <div className="backdrop-blur-sm bg-white/20 dark:bg-black/20 rounded-2xl border border-white/30 dark:border-white/10 p-2 shadow-xl">
            <Icon size={28} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            {subtitle}
          </p>
        </div>
      </div>
    );
};

export default Heading;
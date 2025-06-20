
import { MdOutlineTimelapse } from 'react-icons/md';

const EmptyState = () => {
    return (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="text-gray-400 dark:text-gray-600 mb-2">
              <MdOutlineTimelapse size={48} />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              No recent canvas found
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Start creating to see your work here
            </p>
          </div>
    );
};

export default EmptyState;
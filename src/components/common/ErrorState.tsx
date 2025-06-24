
import { RiEmotionSadLine } from "react-icons/ri";
const ErrorState = () => {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="text-gray-400 dark:text-gray-600 mb-2">
              <RiEmotionSadLine size={48} />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Something went wrong!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Please try again later
            </p>
          </div>
    );
};

export default ErrorState;
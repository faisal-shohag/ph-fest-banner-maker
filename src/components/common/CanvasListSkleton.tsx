import { Skeleton } from '../ui/skeleton';
import Heading from './Heading';
import { FaCircle } from "react-icons/fa";

const CanvasListSkleton = () => {
    return (
      <div className='my-10'>
         <Heading Icon={FaCircle} title={<Skeleton className="h-4 w-3/4 mb-2" />} subtitle={<Skeleton className="h-3 w-[140px] mb-2" />}/>
        <div className='grid grid-cols-2  md:grid-cols-4 lg:grid-cols-5 gap-4'>
         {   Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="overflow-hidden border rounded-xl custom-glass">
                          <div className="aspect-video">
                            <Skeleton className="w-full h-full" />
                          </div>
                          <div className="p-4">
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-3 w-1/2 mb-2" />
                            <Skeleton className="h-3 w-1/4" />
                          </div>
                        </div>
                      ))}
        </div>
        </div>
    );
};

export default CanvasListSkleton;
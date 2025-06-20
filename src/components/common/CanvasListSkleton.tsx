import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

const CanvasListSkleton = () => {
    return (
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4'>
         {   Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className="aspect-video">
                            <Skeleton className="w-full h-full" />
                          </div>
                          <CardContent className="p-4">
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-3 w-1/2 mb-2" />
                            <Skeleton className="h-3 w-1/4" />
                          </CardContent>
                        </Card>
                      ))}
        </div>
    );
};

export default CanvasListSkleton;
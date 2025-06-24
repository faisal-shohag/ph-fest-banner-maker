import { Skeleton } from "@/components/ui/skeleton";

const GallerySkeleton = () => {
  const skeletonItems = Array.from({ length: 10 }, (_, index) => index + 1);

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {skeletonItems.map((item) => (
          <div key={item} className="relative overflow-hidden rounded-lg">
            <Skeleton className="w-full h-64" />
          </div>
        ))}
      </div>
  );
};

export default GallerySkeleton;
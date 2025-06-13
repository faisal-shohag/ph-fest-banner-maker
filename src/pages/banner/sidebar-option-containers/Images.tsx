import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface ImageType {
  id: number;
  title?: string;
  url: string;
  createdAt: string;
  meta?: any;
  userId: number;
}

interface ImageResponse {
  data: ImageType[];
  nextPage?: number;
  hasMore: boolean;
}

const Images = ({handleImageFromURL}) => {
  const observerRef = useRef<HTMLDivElement>(null);

  // Infinite query for images
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['images'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get(`/image?page=${pageParam}&limit=12`);
      return {
        data: response.data,
        nextPage: response.data.length === 12 ? pageParam + 1 : undefined,
        hasMore: response.data.length === 12,
      } as ImageResponse;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Flatten all images from all pages
  const allImages = data?.pages.flatMap((page) => page.data) || [];

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //   });
  // };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
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
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Image Gallery
        </h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Error loading images</p>
          <p className="text-sm mt-1">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="mx-auto">
      <div className="mb-8">
        <p className="text-gray-600 dark:text-gray-400">
          {allImages.length} image{allImages.length !== 1 ? 's' : ''} loaded
        </p>
      </div>

      {allImages.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No images found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Upload some images to see them here.
          </p>
        </div>
      ) : (
        <>
          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {allImages.map((image) => (
              <div
                key={image.id}
                className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-zinc-800" onClick={()=>handleImageFromURL(image.url)}>
                  <img
                    src={image.url}
                    alt={image.title || 'Gallery image'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  
                  />
                </div>
                {/* Image Info */}
                {/* <div className="p-4">
                  {image.title && (
                    <h3 className="font-medium text-gray-900 dark:text-white truncate mb-1">
                      {image.title}
                    </h3>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(image.createdAt)}
                  </p>
                  
                  {image.meta?.width && image.meta?.height && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {image.meta.width} × {image.meta.height}
                    </p>
                  )}
                </div> */}
              </div>
            ))}
          </div>

          {/* Loading indicator for next page */}
          {isFetchingNextPage && (
            <div className="flex justify-center items-center py-8">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-sm">Loading more images...</span>
              </div>
            </div>
          )}

          {/* Intersection observer target */}
          <div
            ref={observerRef}
            className="h-10 flex items-center justify-center"
          >
            {!hasNextPage && allImages.length > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You've reached the end!
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Images;
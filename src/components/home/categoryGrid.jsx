'use client'
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CategoryGrid = ({ productData, categoryInformation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { push } = useRouter()
  const openImageModal = (images, startIndex = 0) => {
    setSelectedImages(images);
    setCurrentImageIndex(startIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImages([]);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === selectedImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedImages.length - 1 : prev - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') closeModal();
  };

  return (
    <>
      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {productData?.children?.map((category) => {
          const categoryInfo = categoryInformation?.find(item => item?.name === category?.label);
          const categoryImages = categoryInfo?.images || [];

          return (
            <div
              key={category?.label}
              className="group relative flex flex-col justify-between rounded-lg border bg-white p-6 pb-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {category?.label}
                </h3>
                <p className="text-gray-500 text-sm mb-3">
                  {categoryInfo?.description}
                </p>

                {/* Display category images */}
                {categoryImages.length > 0 && (
                  <div className="mb-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {categoryImages.slice(0, 6).map((image, index) => (
                        <div
                          key={index}
                          className="relative cursor-pointer group/image"
                          onClick={() => openImageModal(categoryImages, index)}
                        >
                          <img
                            src={image}
                            alt={`${category?.label} image ${index + 1}`}
                            className=" h-12 w-12 object-contain rounded border hover:opacity-80 transition-opacity"
                          />
                          {/* Show "+X more" overlay on last visible image if there are more images */}
                          {index === 5 && categoryImages.length > 6 && (
                            <div className="absolute inset-0 text-center bg-black bg-opacity-50 rounded flex items-center justify-center text-white text-sm font-medium">
                              +{categoryImages.length - 6} more
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                className="w-full justify-between mt-2"
                onClick={() => push(`/product?category=${category?.label}`)}
              >
                <span>View Products</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Image Slideshow Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onKeyDown={handleKeyDown}
          tabIndex={0}
          style={{ outline: 'none' }}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all"
          >
            <X size={20} />
          </button>
          {/* Modal Content */}
          <div className="relative max-w-4xl max-h-full w-full mx-4">

            {/* Navigation Arrows */}
            {selectedImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Main Image */}
            <div className="flex items-center justify-center h-full p-3 bg-white rounded-lg">
              <img
                src={selectedImages[currentImageIndex]}
                alt={`Image ${currentImageIndex + 1}`}
                className=" max-w-[40rem] max-h-[40rem] object-contain rounded-lg"
              />
            </div>

            {/* Image Counter */}
            {selectedImages.length > 1 && (
              <div className="absolute bottom-2  left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {selectedImages.length}
              </div>
            )}

          </div>

          {/* Click outside to close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={closeModal}
          />
        </div>
      )}
    </>
  );
};

export default CategoryGrid;
<style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .thumbnail-container {
          max-width: calc(100vw - 2rem);
        }
      `}</style>

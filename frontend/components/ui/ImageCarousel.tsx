import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface CarouselImage {
  src: string;
  alt: string;
  title: string;
  description?: string;
}

interface ImageCarouselProps {
  images: {
    src: string;
    alt: string;
    title: string;
    description?: string;
  }[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  autoPlay = true,
  interval = 5000,
  showDots = true,
  showArrows = true,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, interval, images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (!images || images.length === 0) {
    return <div className="text-center text-gray-500">No images to display</div>;
  }

  return (
    <div className={`relative w-full ${className}`}>
      {/* Main Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          priority
        />
      </div>

      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <button
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            &lt;
          </button>
          <button
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10"
            onClick={goToNext}
            aria-label="Next image"
          >
            &gt;
          </button>
        </>
      )}

      {/* Dots Navigation - Positioned above the description */}
      {showDots && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-white scale-110' : 'bg-white bg-opacity-50'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Info Overlay - Now at the bottom without overlap */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent text-white p-6 pb-4">
        <h3 className="text-xl font-bold mb-1">{images[currentIndex].title}</h3>
        <p className="text-sm opacity-90">{images[currentIndex].description}</p>
      </div>
    </div>
  );
};

export default ImageCarousel;
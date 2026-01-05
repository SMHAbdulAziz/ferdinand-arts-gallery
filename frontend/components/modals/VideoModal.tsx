import { useEffect, useState } from 'react';

interface VideoModalProps {
  autoOpen?: boolean;
}

export default function VideoModal({ autoOpen = true }: VideoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (autoOpen) {
      setIsOpen(true);
    }
  }, [autoOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full relative">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 text-2xl leading-none"
            aria-label="Close modal"
          >
            ×
          </button>

          {/* Video Container */}
          <div className="w-full bg-black flex items-center justify-center pt-[56.25%] relative">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              width="560"
              height="315"
              src="https://www.youtube.com/embed/uAczP-U7_PI?si=dHB7CU1mHV5rYOgT"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </>
  );
}

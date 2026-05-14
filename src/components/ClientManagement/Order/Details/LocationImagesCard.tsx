import { Camera, ZoomIn } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ImageViewerModal from "@/components/common/Image/Modal/ImageViewerModal";
import { useState } from "react";

interface Props {
  images: string[];
}

const LocationImagesCard = ({
  images
}: Props) => {

  const [initialIndex, setInitialIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const handleViewer = (idx: number) => {
    setOpen(true);
    setInitialIndex(idx);
  }

  return (
    <Card className="border-2 border-gray-200 shadow-sm bg-white">
      <CardHeader className="border-b-2 border-gray-200 pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
          <Camera className="h-6 w-6" />
          Location Images
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {images.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((src, idx) => (
                <div
                  key={idx}
                  onClick={() => handleViewer(idx)}
                  className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all group cursor-pointer"
                >
                  <img
                    src={src}
                    alt={`Location ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="h-8 w-8 text-white" />
                  </div>

                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {idx + 1} / {images.length}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 mt-3">
              Click on any image to view in full screen
            </p>
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />

            <p className="text-base text-gray-600">
              No images uploaded
            </p>
          </div>
        )}

        <ImageViewerModal
          open={open}
          onOpenChange={setOpen}
          images={images || []}
          initialIndex={initialIndex}
        />
      </CardContent>
    </Card>
  );
};

export default LocationImagesCard;
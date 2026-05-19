import { Camera, ImageIcon, ZoomIn } from "lucide-react";
import SectionCard from "../common/Card/SectionCard";
import ImageViewerModal from "../common/Image/Modal/ImageViewerModal";
import { useState } from "react";

interface Props {
    images: string[];
}

const ImagesCard = ({ images }: Props) => {
    const [initialIndex, setInitialIndex] =
        useState(0);

    const [open, setOpen] = useState(false);

    const handleViewer = (idx: number) => {
        setOpen(true);
        setInitialIndex(idx);
    };

    if (!images?.length) return null;

    return (
        <SectionCard
            title="Evidence Images"
            icon={<Camera className="h-5 w-5" />}
        >
            <div className="space-y-6">
                {/* Top Info */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-linear-to-r from-slate-50 to-white p-5 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div
                            className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-violet-100
                text-violet-600
                shadow-sm
              "
                        >
                            <ImageIcon className="h-6 w-6" />
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">
                                Uploaded Evidence
                            </h3>

                            <p className="text-sm text-slate-500">
                                Incident related photos and
                                documentation
                            </p>
                        </div>
                    </div>

                    <div
                        className="
              rounded-full
              bg-violet-100
              px-4
              py-2
              text-sm
              font-semibold
              text-violet-700
            "
                    >
                        {images.length} Images
                    </div>
                </div>

                {/* IMAGES GRID */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {images.map((src, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleViewer(idx)}
                            className="
                group
                relative
                aspect-video
                cursor-pointer
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-slate-100
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
                        >
                            {/* Image */}
                            <img
                                src={src}
                                alt={`Evidence ${idx + 1}`}
                                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-500
                  group-hover:scale-110
                "
                            />

                            {/* Dark Overlay */}
                            <div
                                className="
                  absolute
                  inset-0
                  bg-linear-to-t
                  from-black/70
                  via-black/10
                  to-transparent
                  opacity-0
                  transition-opacity
                  duration-300
                  group-hover:opacity-100
                "
                            />

                            {/* Zoom Icon */}
                            <div
                                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  opacity-0
                  transition-all
                  duration-300
                  group-hover:opacity-100
                "
                            >
                                <div
                                    className="
                    rounded-full
                    bg-white/15
                    p-4
                    backdrop-blur-md
                  "
                                >
                                    <ZoomIn className="h-7 w-7 text-white" />
                                </div>
                            </div>

                            {/* Image Counter */}
                            <div
                                className="
                  absolute
                  bottom-3
                  left-3
                  rounded-full
                  bg-black/60
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-white
                  backdrop-blur
                "
                            >
                                Image {idx + 1}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Hint */}
                <div
                    className="
            rounded-2xl
            border
            border-dashed
            border-slate-300
            bg-slate-50
            px-5
            py-4
            text-center
          "
                >
                    <p className="text-sm text-slate-500">
                        Click on any image to view it in
                        fullscreen mode
                    </p>
                </div>

                {/* MODAL */}
                <ImageViewerModal
                    open={open}
                    onOpenChange={setOpen}
                    images={images || []}
                    initialIndex={initialIndex}
                />
            </div>
        </SectionCard>
    );
};

export default ImagesCard;
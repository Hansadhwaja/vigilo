import {
    Camera,
    ImageIcon,
    ZoomIn,
} from "lucide-react";

import { useState } from "react";

import SectionCard from "@/components/common/Card/SectionCard";
import ImageViewerModal from "@/components/common/Image/Modal/ImageViewerModal";

interface ImagesCardProps {
    title?: string;
    description?: string;
    emptyTitle?: string;
    emptyDescription?: string;
    images: string[];
}

const ImagesCard = ({
    title = "Images",
    description = "Uploaded image gallery",
    emptyTitle = "No images uploaded",
    emptyDescription = "No preview images are available.",
    images,
}: ImagesCardProps) => {
    const [initialIndex, setInitialIndex] =
        useState(0);

    const [open, setOpen] =
        useState(false);

    const handleViewer = (
        idx: number
    ) => {
        setOpen(true);
        setInitialIndex(idx);
    };

    return (
        <SectionCard
            title={title}
            icon={
                <Camera className="h-5 w-5" />
            }
        >
            {images?.length ? (
                <div className="space-y-6">
                    {/* TOP INFO */}
                    <div
                        className="
              relative overflow-hidden
              rounded-2xl border border-slate-200
              bg-linear-to-br
              from-slate-900
              via-slate-800
              to-slate-900
              p-5 text-white
              shadow-lg
            "
                    >
                        {/* Glow */}
                        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-violet-400/20 blur-3xl" />

                        <div className="relative flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div
                                    className="
                    flex h-12 w-12 items-center justify-center
                    rounded-2xl bg-white/10
                    backdrop-blur
                  "
                                >
                                    <ImageIcon className="h-6 w-6 text-violet-300" />
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold tracking-tight">
                                        {title}
                                    </h3>

                                    <p className="text-sm text-slate-300">
                                        {description}
                                    </p>
                                </div>
                            </div>

                            <div
                                className="
                  rounded-full
                  bg-white/10
                  px-4 py-2
                  text-sm font-semibold
                  text-white
                  backdrop-blur
                "
                            >
                                {
                                    images.length
                                }{" "}
                                Images
                            </div>
                        </div>
                    </div>

                    {/* IMAGES GRID */}
                    <div
                        className="
              grid grid-cols-1 gap-5
              sm:grid-cols-2
              xl:grid-cols-3
            "
                    >
                        {images.map(
                            (src, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() =>
                                        handleViewer(
                                            idx
                                        )
                                    }
                                    className="
                    group relative overflow-hidden
                    rounded-2xl border border-slate-200
                    bg-slate-100
                    shadow-sm transition-all duration-300
                    hover:-translate-y-1
                    hover:border-primary/40
                    hover:shadow-xl
                  "
                                >
                                    {/* IMAGE */}
                                    <div className="aspect-video overflow-hidden">
                                        <img
                                            src={
                                                src
                                            }
                                            alt={`Image ${idx +
                                                1
                                                }`}
                                            className="
                          h-full w-full object-cover
                          transition-transform duration-500
                          group-hover:scale-110
                        "
                                        />
                                    </div>

                                    {/* DARK OVERLAY */}
                                    <div
                                        className="
                        absolute inset-0
                        bg-linear-to-t
                        from-black/70
                        via-black/10
                        to-transparent
                        opacity-0
                        transition-opacity duration-300
                        group-hover:opacity-100
                      "
                                    />

                                    {/* ZOOM ICON */}
                                    <div
                                        className="
                        absolute inset-0
                        flex items-center justify-center
                        opacity-0
                        transition-all duration-300
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

                                    {/* IMAGE COUNT */}
                                    <div
                                        className="
                        absolute bottom-3 left-3
                        rounded-full
                        bg-black/60
                        px-3 py-1
                        text-xs font-medium text-white
                        backdrop-blur
                      "
                                    >
                                        Image{" "}
                                        {idx + 1}
                                    </div>
                                </button>
                            )
                        )}
                    </div>

                    {/* BOTTOM HINT */}
                    <div
                        className="
              rounded-2xl border border-dashed
              border-slate-300
              bg-slate-50
              px-5 py-4
              text-center
            "
                    >
                        <p className="text-sm text-slate-500">
                            Click on any image
                            to preview it in
                            fullscreen mode
                        </p>
                    </div>
                </div>
            ) : (
                <div
                    className="
            relative overflow-hidden
            rounded-2xl border border-dashed
            border-slate-300
            bg-linear-to-br
            from-slate-50
            to-white
            px-6 py-14 text-center
          "
                >
                    {/* Glow */}
                    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-slate-200 blur-3xl" />

                    <div className="relative flex flex-col items-center">
                        <div
                            className="
                flex h-16 w-16 items-center justify-center
                rounded-2xl
                bg-slate-100
                text-slate-400
                shadow-sm
              "
                        >
                            <ImageIcon className="h-8 w-8" />
                        </div>

                        <h3
                            className="
                mt-4 text-base font-semibold
                text-slate-700
              "
                        >
                            {emptyTitle}
                        </h3>

                        <p
                            className="
                mt-1 max-w-sm text-sm
                text-slate-500
              "
                        >
                            {
                                emptyDescription
                            }
                        </p>
                    </div>
                </div>
            )}

            {/* MODAL */}
            <ImageViewerModal
                open={open}
                onOpenChange={setOpen}
                images={images || []}
                initialIndex={initialIndex}
            />
        </SectionCard>
    );
};

export default ImagesCard;
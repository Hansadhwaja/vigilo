import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ImageViewerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    images: string[];

    initialIndex?: number;
}

const ImageViewerModal = ({
    open,
    onOpenChange,
    images,
    initialIndex = 0,
}: ImageViewerModalProps) => {

    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(initialIndex + 1);

    useEffect(() => {
        if (!api) return;

        api.scrollTo(initialIndex);

        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api, initialIndex]);

    if (!images?.length) return null;

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-black/95 overflow-hidden">

                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="absolute top-4 left-4 z-50 bg-black/60 text-white px-4 py-2 rounded-md text-sm">
                    {current} / {images.length}
                </div>

                <Carousel
                    setApi={setApi}
                    className="w-full"
                >
                    <CarouselContent>
                        {images.map((image, index) => (
                            <CarouselItem key={index}>
                                <div className="h-[95vh] flex items-center justify-center">
                                    <img
                                        src={image}
                                        alt={`Image ${index + 1}`}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {images.length > 1 && (
                        <>
                            <CarouselPrevious className="left-4 bg-white/10 border-none text-white hover:bg-white/20" />

                            <CarouselNext className="right-4 bg-white/10 border-none text-white hover:bg-white/20" />
                        </>
                    )}
                </Carousel>
            </DialogContent>
        </Dialog>
    );
};

export default ImageViewerModal;
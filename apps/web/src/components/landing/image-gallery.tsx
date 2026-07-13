"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { ListingImage } from "@/features/listing/types";

export function ImageGallery({
  images,
  code,
}: {
  images: ListingImage[];
  code: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const cover =
    images.find((img) => img.is_cover) || images[0] || null;
  const thumbnails = images.filter((img) => img.id !== cover?.id).slice(0, 4);

  const slides = images.map((img) => ({
    src: img.url,
    alt: img.caption || code,
  }));

  if (!cover) {
    return (
      <div className="h-[480px] bg-black/5 flex items-center justify-center text-slate mb-4">
        Chưa có ảnh
      </div>
    );
  }

  const openAt = (imageId: number) => {
    const idx = images.findIndex((img) => img.id === imageId);
    setIndex(idx >= 0 ? idx : 0);
    setOpen(true);
  };

  return (
    <div>
      <button
        onClick={() => openAt(cover.id)}
        className="block w-full h-[480px] overflow-hidden mb-4 cursor-zoom-in group relative"
      >
        <img
          src={cover.url}
          alt={cover.caption || code}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-ink/70 text-white text-xs font-mono px-3 py-1.5">
            {images.length} ảnh — Xem tất cả
          </span>
        )}
      </button>

      {thumbnails.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {thumbnails.map((img) => (
            <button
              key={img.id}
              onClick={() => openAt(img.id)}
              className="h-24 overflow-hidden cursor-zoom-in"
            >
              <img
                src={img.url}
                alt={img.caption || code}
                className="w-full h-full object-cover hover:opacity-80 transition-opacity"
              />
            </button>
          ))}
        </div>
      )}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
      />
    </div>
  );
}

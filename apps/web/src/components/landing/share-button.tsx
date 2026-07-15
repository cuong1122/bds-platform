"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export function ShareButton({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const shareRef = useRef<HTMLDivElement>(null);

  // Click bên ngoài để đóng menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareRef.current &&
        !shareRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setShowQR(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);


  // Nhấn ESC để đóng
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setShowQR(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);


  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {
      console.error("Copy failed:", error);
    }
  };


  const toggleShare = () => {
    setOpen((prev) => !prev);

    if (open) {
      setShowQR(false);
    }
  };


  return (
    <div
      ref={shareRef}
      className="relative"
    >

      <button
        onClick={toggleShare}
        className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-slate hover:text-gold-dark border border-black/15 px-4 py-2.5"
      >
        Chia Sẻ
      </button>


      {open && (
        <div
          className="
            absolute 
            top-full 
            mt-2 
            right-0 
            bg-cream-raised 
            border 
            border-black/10 
            shadow-lg 
            p-3 
            w-60 
            z-20
          "
        >

          <button
            onClick={handleCopyLink}
            className="
              w-full 
              text-left 
              px-3 
              py-2 
              text-sm 
              hover:bg-black/5 
              flex 
              justify-between
            "
          >
            <span>
              Copy URL
            </span>

            {copied && (
              <span className="text-green-600 text-xs">
                Đã copy
              </span>
            )}

          </button>


          <button
            onClick={() => setShowQR((prev) => !prev)}
            className="
              w-full 
              text-left 
              px-3 
              py-2 
              text-sm 
              hover:bg-black/5
            "
          >
            Tạo QR Code
          </button>


          {showQR && (
            <div
              className="
                mt-3 
                flex 
                flex-col 
                items-center 
                gap-2
              "
            >

              <QRCodeSVG
                value={url}
                size={160}
              />


              <p className="text-xs text-slate text-center">
                Quét QR để mở trang này
              </p>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

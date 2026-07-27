"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ZoomableImageProps = {
  src: string;
  alt: string;
  title: string;
  caption: string;
  className?: string;
  eager?: boolean;
  protectedPreview?: boolean;
};

export default function ZoomableImage({
  src,
  alt,
  title,
  caption,
  className = "",
  eager = false,
  protectedPreview = false,
}: ZoomableImageProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <figure className={`zoomFigure ${protectedPreview ? "zoomProtected" : ""} ${className}`.trim()}>
        {protectedPreview ? (
          <div className="zoomProtectedFrame">
            <img src={src} alt={alt} loading="lazy" decoding="async" />
          </div>
        ) : (
          <button
            className="zoomTrigger"
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`Otevřít obrázek v plné velikosti: ${title}`}
          >
            <img
              src={src}
              alt={alt}
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={eager ? "high" : "auto"}
            />
            <span className="zoomHint" aria-hidden="true">Zvětšit ↗</span>
          </button>
        )}
        <figcaption>
          <strong>{title}</strong>
          <span>{caption}</span>
          {protectedPreview && <em>Jen malý náhled · bez zvětšení</em>}
        </figcaption>
      </figure>

      {open && typeof document !== "undefined" && createPortal(
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={title} onMouseDown={() => setOpen(false)}>
          <button className="lightboxClose" type="button" onClick={() => setOpen(false)} aria-label="Zavřít obrázek">
            Zavřít ×
          </button>
          <div className="lightboxInner" onMouseDown={(event) => event.stopPropagation()}>
            <img src={src} alt={alt} />
            <div className="lightboxText">
              <div>
                <strong>{title}</strong>
                <p>{caption}</p>
              </div>
              <a href={src} target="_blank" rel="noreferrer">Otevřít originál ↗</a>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

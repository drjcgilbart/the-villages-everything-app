"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import {
  golfScorecardAsset,
  type GolfCourse,
} from "@/lib/entertainmentCatalog";

function printScorecard(url: string, type: "pdf" | "jpg", title: string) {
  if (type === "pdf") {
    const w = window.open(url, "_blank", "noopener");
    if (!w) return;
    window.setTimeout(() => {
      try {
        w.focus();
        w.print();
      } catch {
        /* browser PDF viewer handles print */
      }
    }, 800);
    return;
  }
  const w = window.open("", "_blank");
  if (!w) {
    window.open(url, "_blank", "noopener");
    return;
  }
  const safeTitle = title.replace(/[<>&"]/g, "");
  w.document.write(
    `<!doctype html><html><head><title>${safeTitle}</title><style>
      html,body{margin:0;background:#fff}
      img{max-width:100%;display:block;margin:0 auto}
    </style></head><body>
      <img src="${url}" alt="${safeTitle}" onload="window.focus();window.print()">
    </body></html>`
  );
  w.document.close();
}

export function GolfScorecardButton({ course }: { course: GolfCourse }) {
  const asset = golfScorecardAsset(course);
  const titleId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!asset) return null;

  const dialog =
    open && typeof document !== "undefined"
      ? createPortal(
          <div
            className="ms-golf-sc-overlay"
            role="presentation"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <div
              className="ms-golf-sc-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
            >
              <div className="ms-golf-sc-head">
                <div>
                  <p className="panel-hint" style={{ margin: 0 }}>
                    Official Golf The Villages scorecard
                  </p>
                  <h3 id={titleId} style={{ margin: "0.2rem 0 0" }}>
                    {course.name}
                  </h3>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
              <div className="ms-golf-sc-frame">
                {asset.type === "jpg" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={asset.url} alt={`${course.name} scorecard`} />
                ) : (
                  <iframe
                    title={`${course.name} scorecard PDF`}
                    src={asset.url}
                  />
                )}
              </div>
              <div className="hero-actions" style={{ marginTop: "0.85rem" }}>
                <a
                  className="btn btn-primary btn-sm"
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
                <a
                  className="btn btn-ghost btn-sm"
                  href={asset.url}
                  download={asset.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Save
                </a>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => printScorecard(asset.url, asset.type, course.name)}
                >
                  Print
                </button>
              </div>
              <p className="panel-hint" style={{ marginBottom: 0 }}>
                Official card from Golf The Villages. Save opens the file so you can keep a
                copy; Print uses your printer or Save as PDF.
              </p>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(true)}>
        Scorecard
      </button>
      {dialog}
    </>
  );
}

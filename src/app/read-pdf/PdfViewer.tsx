"use client";

import { useSearchParams } from "next/navigation";

function viewSrc(file: string) {
  if (!file.startsWith("/api/media/")) return "";
  if (file.includes("..") || file.includes("\\") || file.includes("//")) return "";
  return file.toLowerCase().endsWith(".pdf") ? file : `${file}.pdf`;
}

export function PdfViewer() {
  const file = useSearchParams().get("file") || "";
  const src = viewSrc(file);
  if (!src) {
    return (
      <p className="shell" style={{ padding: "2rem 0" }}>
        That PDF could not be opened.
      </p>
    );
  }
  return (
    <div className="pdf-screen">
      <div className="pdf-screen-bar">
        <strong>PDF</strong>
        <a className="btn btn-primary btn-sm" href={src} download>
          Save a copy
        </a>
      </div>
      <iframe title="PDF" src={src} />
    </div>
  );
}

"use client";

function pdfFileHref(href: string) {
  if (!href.startsWith("/api/media/")) return href;
  return href.toLowerCase().endsWith(".pdf") ? href : `${href}.pdf`;
}

export function PdfLinkCard({
  href,
  label,
  compact = false,
}: {
  href: string;
  label: string;
  compact?: boolean;
}) {
  return (
    <a
      className={compact ? "pdf-card pdf-card-compact" : "pdf-card"}
      href={pdfFileHref(href)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg className="pdf-card-art" viewBox="0 0 120 148" aria-hidden="true">
        <rect x="8" y="8" width="104" height="132" rx="10" fill="#fffaf2" stroke="#1f6b4a" strokeWidth="3" />
        <path d="M78 8h18a10 10 0 0 1 10 10v18H88a10 10 0 0 1-10-10V8z" fill="#e7f2ea" stroke="#1f6b4a" strokeWidth="3" />
        <path d="M24 48h72M24 66h72M24 84h52" stroke="#c4b49a" strokeWidth="4" strokeLinecap="round" />
        <rect x="24" y="102" width="46" height="20" rx="6" fill="#1f6b4a" />
        <text x="47" y="116" textAnchor="middle" fill="#fffaf2" fontSize="12" fontFamily="Georgia, serif" fontWeight="700">
          PDF
        </text>
      </svg>
      <span className="pdf-card-label">{label}</span>
    </a>
  );
}

import { Suspense } from "react";
import { PdfViewer } from "./PdfViewer";

export const metadata = { title: "PDF" };

export default function ReadPdfPage() {
  return (
    <Suspense>
      <PdfViewer />
    </Suspense>
  );
}

import Image from "next/image";
import Link from "next/link";
import { PhotoCard } from "@/components/PhotoCard";
import { getPhotosAsync } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Photos · My Retirement Reboot" };

export default async function PhotosPage() {
  const photos = await getPhotosAsync();

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <p style={{ margin: "0 0 0.5rem" }}>
              <Link href="/about" className="text-link">
                ← My Retirement Reboot
              </Link>
            </p>
            <span className="kicker">Snapshots from the reboot</span>
            <h1>Photo Journal</h1>
            <p>
              Pictures from The Villages life — carts, chaos, sunsets, and
              whatever else makes the highlight reel — each with a short note.
            </p>
          </div>
          <div className="page-hero-art">
            <Image
              src="/graphics/theme-photos.jpg"
              alt=""
              width={260}
              height={260}
              className="page-hero-img"
            />
          </div>
        </div>
      </div>
      <section className="section">
        <div className="shell">
          {photos.length === 0 ? (
            <div className="empty-state">
              No photos yet. Add some from Studio → Photo Journal.
            </div>
          ) : (
            <div className="photo-grid">
              {photos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

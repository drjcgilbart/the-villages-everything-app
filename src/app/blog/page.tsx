import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { getPostsAsync } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Blog · My Retirement Reboot" };

export default async function BlogPage() {
  const posts = await getPostsAsync("blog");

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
            <span className="kicker">Written chaos</span>
            <h1>Blog</h1>
            <p>
              Essays, rants, and field notes from a retirement reboot in The
              Villages — health, wealth, and everything else in between.
            </p>
          </div>
          <div className="page-hero-art">
            <Image
              src="/graphics/theme-blog.jpg"
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
          {posts.length === 0 ? (
            <div className="empty-state">No blog posts yet. Publish one in Studio.</div>
          ) : (
            <div className="card-grid">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

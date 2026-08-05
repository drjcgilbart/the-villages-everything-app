import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/format";

function artForPost(post: Post) {
  if (post.coverImage) return post.coverImage;
  const tags = (post.tags || []).map((t) => t.toLowerCase());
  if (tags.some((t) => /health|walk|med|fitness|weight/.test(t))) {
    return "/graphics/theme-health.jpg";
  }
  if (tags.some((t) => /wealth|money|market|invest|stock/.test(t))) {
    return "/graphics/theme-wealth.jpg";
  }
  if (post.type === "vlog") return "/graphics/theme-chaos.jpg";
  return "/graphics/hero-cart-v4.jpg";
}

export function PostCard({ post }: { post: Post }) {
  const art = artForPost(post);

  return (
    <article className="card post-card post-card-graphic">
      <Link href={`/blog/${post.slug}`} className="post-card-art">
        <Image src={art} alt="" width={640} height={360} className="post-card-img" />
      </Link>
      <div className="post-card-body">
        <div className="card-meta">
          <span className={`pill pill-${post.type}`}>
            {post.type === "vlog" ? "episode" : post.type}
          </span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </div>
        <h3>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p>{post.excerpt}</p>
        {post.tags?.length > 0 && (
          <div className="tag-row">
            {post.tags.slice(0, 4).map((t) => (
              <span key={t} className="tag">
                #{t}
              </span>
            ))}
          </div>
        )}
        <Link href={`/blog/${post.slug}`} className="text-link">
          Read more →
        </Link>
      </div>
    </article>
  );
}

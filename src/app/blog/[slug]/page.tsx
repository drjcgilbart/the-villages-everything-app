import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/content";
import { formatDate, paragraphs } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const paras = paragraphs(post.body);

  return (
    <article>
      <div className="article-hero">
        <div className="shell">
          <div className="card-meta">
            <span className={`pill pill-${post.type}`}>
              {post.type === "vlog" ? "episode" : post.type}
            </span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </div>
          <h1>{post.title}</h1>
          <p className="subtitle" style={{ marginBottom: "0.5rem" }}>
            {post.excerpt}
          </p>
          {post.tags?.length > 0 && (
            <div className="tag-row">
              {post.tags.map((t) => (
                <span key={t} className="tag">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="section">
        <div className="shell prose">
          {paras.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p style={{ marginTop: "2rem" }}>
            <Link href={post.type === "vlog" ? "/videos" : "/blog"} className="text-link">
              ← Back to {post.type === "vlog" ? "videos" : "blog"}
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlugAsync } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { blocksForPost, photosNotInBody } from "@/lib/postDraft";
import type { PhotoImage } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlugAsync(slug);
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
  const post = await getPostBySlugAsync(slug);
  if (!post) notFound();

  const images = Array.isArray(post.images) ? post.images : [];
  const cover =
    images.find((img) => img.id === post.featuredImageId) ||
    (post.coverImage ? images.find((img) => img.url === post.coverImage) : undefined) ||
    images[0];
  const blocks = blocksForPost(post.body, images);
  const trailing = photosNotInBody(post.body, images, cover?.id);

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
          {cover?.url && !post.body.includes(`[[photo:${cover.id}]]`) ? (
            <PostFigure image={cover} cover />
          ) : null}
        </div>
      </div>
      <div className="section">
        <div className="shell prose">
          {blocks.map((block, i) =>
            block.kind === "photo" ? (
              <PostFigure key={`${block.image.id}-${i}`} image={block.image} />
            ) : (
              <p key={i}>{block.text}</p>
            )
          )}
          {trailing.length > 0 && (
            <div className="article-photo-end">
              {trailing.map((image) => (
                <PostFigure key={image.id} image={image} />
              ))}
            </div>
          )}
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

function PostFigure({ image, cover }: { image: PhotoImage; cover?: boolean }) {
  return (
    <figure className={cover ? "article-cover" : "prose-figure"}>
      {/* Uploads are served by /api/media, which the image optimizer does not host. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.url} alt={image.caption || ""} />
      {image.caption ? <figcaption>{image.caption}</figcaption> : null}
    </figure>
  );
}

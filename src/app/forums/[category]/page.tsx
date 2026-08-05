import Link from "next/link";
import { notFound } from "next/navigation";
import { NewThreadForm } from "@/components/ForumForms";
import {
  countReplies,
  getCategoryBySlug,
  getVisibleThreads,
} from "@/lib/forum";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return { title: "Forum" };
  return {
    title: cat.title,
    description: cat.description,
  };
}

export default async function ForumCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();

  const threads = getVisibleThreads(cat.id);

  return (
    <>
      <div className="page-hero">
        <div className="shell">
          <p style={{ margin: 0 }}>
            <Link href="/forums" className="text-link">
              ← All forums
            </Link>
          </p>
          <span className="kicker" style={{ marginTop: "0.75rem", display: "inline-flex" }}>
            {cat.emoji} Main topic
          </span>
          <h1 style={{ marginTop: "0.5rem" }}>{cat.title}</h1>
          <p className="subtitle">{cat.description}</p>
        </div>
      </div>

      <section className="section">
        <div className="shell">
          <div className="forum-category-actions">
            <NewThreadForm categoryId={cat.id} categorySlug={cat.slug} />
          </div>

          <div className="section-head" style={{ marginTop: "1.5rem" }}>
            <div>
              <h2>Conversations</h2>
              <p>
                Sub-topics started by villagers — click one to chat back and
                forth.
              </p>
            </div>
          </div>

          {threads.length === 0 ? (
            <div className="empty-state">
              No conversations yet. Be the first — start one above and set the
              tone (preferably friendly).
            </div>
          ) : (
            <div className="forum-thread-list">
              {threads.map((thread) => {
                const replies = countReplies(thread.id);
                return (
                  <Link
                    key={thread.id}
                    href={`/forums/${cat.slug}/${thread.id}`}
                    className="forum-thread-row about-panel"
                  >
                    <div>
                      {thread.pinned && (
                        <span className="pill pill-rank">Pinned</span>
                      )}
                      <h3>{thread.title}</h3>
                      <p className="forum-thread-meta">
                        {thread.authorName} · {replies} repl
                        {replies === 1 ? "y" : "ies"} · updated{" "}
                        {formatDate(thread.updatedAt)}
                      </p>
                      <p className="forum-thread-excerpt">
                        {thread.body.slice(0, 160)}
                        {thread.body.length > 160 ? "…" : ""}
                      </p>
                    </div>
                    <span className="text-link">Chat →</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { ReplyForm } from "@/components/ForumForms";
import { MemberName } from "@/components/MemberName";
import {
  getCategoryBySlug,
  getRepliesForThread,
  getThreadById,
} from "@/lib/forum";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; threadId: string }>;
}) {
  const { threadId } = await params;
  const thread = getThreadById(threadId);
  if (!thread) return { title: "Conversation" };
  return {
    title: thread.title,
    description: thread.body.slice(0, 160),
  };
}

export default async function ForumThreadPage({
  params,
}: {
  params: Promise<{ category: string; threadId: string }>;
}) {
  const { category: slug, threadId } = await params;
  const cat = getCategoryBySlug(slug);
  const thread = getThreadById(threadId);
  if (!cat || !thread || thread.categoryId !== cat.id) notFound();

  const replies = getRepliesForThread(thread.id);

  return (
    <article>
      <div className="article-hero">
        <div className="shell">
          <p style={{ margin: "0 0 0.75rem" }}>
            <Link href="/forums" className="text-link">
              Forums
            </Link>
            {" · "}
            <Link href={`/forums/${cat.slug}`} className="text-link">
              {cat.title}
            </Link>
          </p>
          <div className="card-meta">
            <span className="pill pill-cuisine">
              {cat.emoji} {cat.title}
            </span>
            <time dateTime={thread.createdAt}>
              {formatDate(thread.createdAt)}
            </time>
          </div>
          <h1>{thread.title}</h1>
          <p className="forum-op-meta">
            Started by{" "}
            <MemberName
              name={thread.authorName}
              memberId={thread.authorMemberId}
              as="strong"
            />
            {thread.locked ? " · Locked" : ""}
          </p>
        </div>
      </div>

      <section className="section">
        <div className="shell forum-thread-layout">
          <div className="forum-chat">
            <div className="forum-post about-panel forum-post-op">
              <div className="forum-post-head">
                <MemberName
                  name={thread.authorName}
                  memberId={thread.authorMemberId}
                  as="strong"
                />
                <time dateTime={thread.createdAt}>
                  {formatDate(thread.createdAt)}
                </time>
              </div>
              <div className="forum-post-body">
                {thread.body.split(/\n+/).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            {replies.map((reply) => (
              <div key={reply.id} className="forum-post about-panel">
                <div className="forum-post-head">
                  <MemberName
                    name={reply.authorName}
                    memberId={reply.authorMemberId}
                    as="strong"
                  />
                  <time dateTime={reply.createdAt}>
                    {formatDate(reply.createdAt)}
                  </time>
                </div>
                <div className="forum-post-body">
                  {reply.body.split(/\n+/).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            ))}

            {!thread.locked ? (
              <ReplyForm threadId={thread.id} />
            ) : (
              <div className="empty-state">
                This conversation is locked — no new replies.
              </div>
            )}
          </div>

          <aside className="forum-thread-aside">
            <div className="quote-box">
              “Be the neighbor you&apos;d want two carts over.”
            </div>
            <div className="about-panel" style={{ marginTop: "1rem" }}>
              <h2>In this topic</h2>
              <p style={{ color: "var(--muted)", marginTop: 0 }}>
                {cat.description}
              </p>
              <Link href={`/forums/${cat.slug}`} className="text-link">
                ← All conversations in {cat.title}
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </article>
  );
}

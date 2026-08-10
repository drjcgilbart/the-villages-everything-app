import Link from "next/link";
import { notFound } from "next/navigation";
import { ReplyForm } from "@/components/ForumForms";
import { ForumPost } from "@/components/ForumPost";
import { MemberName } from "@/components/MemberName";
import {
  getCategoryBySlug,
  getRepliesForThread,
  getThreadByIdAsync,
} from "@/lib/forum";
import { formatDate } from "@/lib/format";
import { resolveAuthorBadges } from "@/lib/memberBadges";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; threadId: string }>;
}) {
  const { threadId } = await params;
  const thread = await getThreadByIdAsync(threadId);
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
  // Fresh durable pull (+ retry) so posts from another serverless instance
  // resolve on the first request after create (not blocked by hydrate TTL).
  const thread = await getThreadByIdAsync(threadId);
  const cat = getCategoryBySlug(slug);
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
            {thread.editedAt ? " · Edited" : ""}
            {thread.locked ? " · Locked" : ""}
          </p>
        </div>
      </div>

      <section className="section">
        <div className="shell forum-thread-layout">
          <div className="forum-chat">
            <ForumPost
              kind="thread"
              id={thread.id}
              authorName={thread.authorName}
              authorMemberId={thread.authorMemberId}
              badges={resolveAuthorBadges({
                memberId: thread.authorMemberId,
                authorName: thread.authorName,
              })}
              body={thread.body}
              title={thread.title}
              createdAt={thread.createdAt}
              editedAt={thread.editedAt}
              locked={thread.locked}
              className="forum-post-op"
            />

            {replies.map((reply) => (
              <ForumPost
                key={reply.id}
                kind="reply"
                id={reply.id}
                authorName={reply.authorName}
                authorMemberId={reply.authorMemberId}
                badges={resolveAuthorBadges({
                  memberId: reply.authorMemberId,
                  authorName: reply.authorName,
                })}
                body={reply.body}
                createdAt={reply.createdAt}
                editedAt={reply.editedAt}
                locked={thread.locked}
              />
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

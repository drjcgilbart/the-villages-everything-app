import Image from "next/image";
import Link from "next/link";
import { MemberName } from "@/components/MemberName";
import {
  categoryStats,
  forumSummary,
  getCategories,
  getVisibleThreads,
} from "@/lib/forum";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Community Forums",
  description:
    "Public community forums for The Villages, Florida — start conversations, reply, and chat with neighbors.",
};

export default function ForumsPage() {
  const categories = getCategories();
  const summary = forumSummary();
  const recent = getVisibleThreads().slice(0, 6);

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">Public chat · neighborly · free</span>
            <h1>Community Forums</h1>
            <p>
              The Villages water cooler, upgraded. Pick a main topic, start a
              conversation (sub-topic), and chat back and forth with fellow
              cart pilots. Be kind — these are your neighbors.
            </p>
            <div className="dining-summary-stats">
              <div className="stat">
                <strong>{summary.categoryCount}</strong>
                <span>Main topics</span>
              </div>
              <div className="stat">
                <strong>{summary.threadCount}</strong>
                <span>Conversations</span>
              </div>
              <div className="stat">
                <strong>{summary.replyCount}</strong>
                <span>Replies</span>
              </div>
            </div>
          </div>
          <div className="page-hero-art">
            <Image
              src="/graphics/theme-chaos.jpg"
              alt=""
              width={260}
              height={260}
              className="page-hero-img"
              priority
            />
          </div>
        </div>
      </div>

      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Main forum topics</h2>
              <p>
                Start here — then open a conversation inside, or start a new
                one. No password required (just a display name).
              </p>
            </div>
          </div>

          <div className="forum-category-list">
            {categories.map((cat) => {
              const stats = categoryStats(cat.id);
              return (
                <Link
                  key={cat.id}
                  href={`/forums/${cat.slug}`}
                  className="forum-category-card about-panel"
                >
                  <span className="forum-category-emoji" aria-hidden>
                    {cat.emoji}
                  </span>
                  <div className="forum-category-body">
                    <h3>{cat.title}</h3>
                    <p>{cat.description}</p>
                    <span className="forum-category-meta">
                      {stats.threadCount} conversation
                      {stats.threadCount === 1 ? "" : "s"} · {stats.replyCount}{" "}
                      repl
                      {stats.replyCount === 1 ? "y" : "ies"}
                    </span>
                  </div>
                  <span className="text-link forum-category-go">Open →</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="shell">
            <div className="section-head">
              <div>
                <h2>Recently active</h2>
                <p>Conversations still warming up across the hub.</p>
              </div>
            </div>
            <div className="forum-thread-list">
              {recent.map((thread) => {
                const cat = categories.find((c) => c.id === thread.categoryId);
                if (!cat) return null;
                return (
                  <Link
                    key={thread.id}
                    href={`/forums/${cat.slug}/${thread.id}`}
                    className="forum-thread-row about-panel"
                  >
                    <div>
                      <span className="forum-thread-cat">
                        {cat.emoji} {cat.title}
                      </span>
                      <h3>{thread.title}</h3>
                      <p className="forum-thread-meta">
                        Started by{" "}
                        <MemberName
                          name={thread.authorName}
                          memberId={thread.authorMemberId}
                        />{" "}
                        · updated {formatDate(thread.updatedAt)}
                      </p>
                    </div>
                    <span className="text-link">Chat →</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="about-panel">
            <h2 style={{ marginTop: 0 }}>House rules (short version)</h2>
            <ul className="forum-rules">
              <li>Be neighborly — no bullying, scams, or political pile-ons.</li>
              <li>No medical, legal, or financial advice presented as gospel.</li>
              <li>Personal info stays personal — don&apos;t post addresses or phone numbers you wouldn&apos;t yell across a square.</li>
              <li>This is a public resident forum, not official The Villages® support.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

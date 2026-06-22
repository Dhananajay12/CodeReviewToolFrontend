import { useToggleIssue, usePostReview } from "../hooks/useGithub";
import { notify, getErrorMessage } from "../helpers/toast";
import Spinner from "./Spinner";
import type { Review, ReviewIssue, IssueSeverity } from "../types/github";

const severityStyle: Record<IssueSeverity, string> = {
  critical: "bg-red-500/15 text-red-300 border-red-500/30",
  warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  suggestion: "bg-violet-500/15 text-violet-300 border-violet-500/30",
};

function IssueCard({
  issue,
  onToggle,
}: {
  issue: ReviewIssue;
  onToggle: (included: boolean) => void;
}) {
  return (
    <div
      className={`rounded-xl border p-4 transition ${
        issue.included
          ? "border-white/10 bg-white/5"
          : "border-white/5 bg-white/2 opacity-55"
      }`}
    >
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <input
          type="checkbox"
          checked={issue.included}
          onChange={(e) => onToggle(e.target.checked)}
          title="Include this comment when posting to the PR"
          className="h-4 w-4 cursor-pointer accent-violet-400"
        />
        <span
          className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${severityStyle[issue.severity]}`}
        >
          {issue.severity}
        </span>
        <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/60">
          {issue.category}
        </span>
        <span className="font-mono text-xs text-white/45">
          {issue.file}
          {issue.line !== null ? `:${issue.line}` : ""}
        </span>
        {issue.posted && (
          <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
            posted
          </span>
        )}
      </div>
      <p className="text-sm text-white/85">{issue.message}</p>
      {issue.suggestedFix && (
        <pre className="mt-2 overflow-auto rounded-lg bg-black/40 p-3 text-xs text-white/75">
          {issue.suggestedFix}
        </pre>
      )}
    </div>
  );
}

type ReviewDetailProps = {
  review: Review | null;
  emptyMessage: string;
  onReviewChange: (review: Review) => void;
};

function ReviewDetail({
  review,
  emptyMessage,
  onReviewChange,
}: ReviewDetailProps) {
  const toggleMutation = useToggleIssue();
  const postMutation = usePostReview();

  async function toggleInclude(issueId: string, included: boolean) {
    if (!review) return;
    onReviewChange({
      ...review,
      issues: review.issues.map((i) =>
        i.id === issueId ? { ...i, included } : i,
      ),
    });
    try {
      await toggleMutation.mutateAsync({ reviewId: review.id, issueId, included });
    } catch (err) {
      onReviewChange({
        ...review,
        issues: review.issues.map((i) =>
          i.id === issueId ? { ...i, included: !included } : i,
        ),
      });
      notify.error(getErrorMessage(err));
    }
  }

  async function postToPr() {
    if (!review) return;
    try {
      const result = await postMutation.mutateAsync(review.id);
      notify.success(
        `Posted ${result.posted} comment${result.posted === 1 ? "" : "s"} to the PR (${result.inline} inline, ${result.summary} in summary)`,
      );
      onReviewChange({
        ...review,
        issues: review.issues.map((i) =>
          i.included ? { ...i, posted: true } : i,
        ),
      });
    } catch (err) {
      notify.error(getErrorMessage(err));
    }
  }

  const canPost =
    review?.status === "completed" &&
    review.issues.some((i) => i.included && !i.posted);

  return (
    <section className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f14]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <span className="text-sm font-semibold">Review result</span>
        {review?.status === "completed" && (
          <button
            onClick={postToPr}
            disabled={!canPost || postMutation.isPending}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-300 to-indigo-300 px-4 py-1.5 text-xs font-semibold text-black transition hover:from-violet-200 hover:to-indigo-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {postMutation.isPending ? (
              <>
                <Spinner /> Posting…
              </>
            ) : canPost ? (
              "Post to PR"
            ) : (
              "Posted ✓"
            )}
          </button>
        )}
      </div>
      <div className="flex-1 overflow-auto p-5">
        {!review ? (
          <p className="mt-8 text-center text-sm text-white/35">
            {emptyMessage}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-semibold">
                  #{review.prNumber} {review.prTitle}
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                    review.status === "completed"
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-red-500/15 text-red-300"
                  }`}
                >
                  {review.status}
                </span>
              </div>
              {review.summary && (
                <p className="text-sm leading-relaxed text-white/70">
                  {review.summary}
                </p>
              )}
              {review.error && (
                <p className="text-sm text-red-300">{review.error}</p>
              )}
            </div>

            {review.issues.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-white/40">
                  {review.issues.length} issue
                  {review.issues.length === 1 ? "" : "s"} ·{" "}
                  {review.issues.filter((i) => i.included).length} selected
                </p>
                {review.issues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onToggle={(included) => toggleInclude(issue.id, included)}
                  />
                ))}
              </div>
            )}

            {review.status === "completed" && review.issues.length === 0 && (
              <p className="text-sm text-emerald-300">No issues found. 🎉</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default ReviewDetail;

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useRepos,
  usePulls,
  useCreateReview,
  useToggleIssue,
  usePostReview,
  useGithubConnection,
} from "../hooks/useGithub";
import { notify, getErrorMessage } from "../helpers/toast";
import type { Review, ReviewIssue, IssueSeverity } from "../types/github";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const severityStyle: Record<IssueSeverity, string> = {
  critical: "bg-red-500/15 text-red-300 border-red-500/30",
  warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  suggestion: "bg-violet-500/15 text-violet-300 border-violet-500/30",
};

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

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
          : "border-white/5 bg-white/[0.02] opacity-55"
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

function PrReview() {
  const queryClient = useQueryClient();
  const reposQuery = useRepos();
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);
  const pullsQuery = usePulls(selectedRepoId);
  const connectionQuery = useGithubConnection();
  const reviewMutation = useCreateReview();
  const toggleMutation = useToggleIssue();
  const postMutation = usePostReview();
  const manageUrl = connectionQuery.data?.[0]?.manageUrl;

  function refreshRepos() {
    queryClient.invalidateQueries({ queryKey: ["github", "repos"] });
  }
  const [review, setReview] = useState<Review | null>(null);
  const [reviewingPr, setReviewingPr] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("github") === "connected") {
      notify.success("GitHub connected");
      queryClient.invalidateQueries({ queryKey: ["github", "repos"] });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [queryClient]);

  function connectGithub() {
    window.location.href = `${BACKEND_URL}/github/connect`;
  }

  async function runReview(prNumber: number) {
    if (!selectedRepoId) return;
    try {
      setReviewingPr(prNumber);
      const result = await reviewMutation.mutateAsync({
        repoId: selectedRepoId,
        prNumber,
      });
      setReview(result);
      if (result.status === "failed") {
        notify.error(result.error ?? "Review failed");
      } else {
        notify.success("Review complete");
      }
    } catch (err) {
      notify.error(getErrorMessage(err));
    } finally {
      setReviewingPr(null);
    }
  }

  async function toggleInclude(issueId: string, included: boolean) {
    if (!review) return;
    setReview((prev) =>
      prev
        ? {
            ...prev,
            issues: prev.issues.map((i) =>
              i.id === issueId ? { ...i, included } : i,
            ),
          }
        : prev,
    );
    try {
      await toggleMutation.mutateAsync({ reviewId: review.id, issueId, included });
    } catch (err) {
      // revert on failure
      setReview((prev) =>
        prev
          ? {
              ...prev,
              issues: prev.issues.map((i) =>
                i.id === issueId ? { ...i, included: !included } : i,
              ),
            }
          : prev,
      );
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
      setReview((prev) =>
        prev
          ? {
              ...prev,
              issues: prev.issues.map((i) =>
                i.included ? { ...i, posted: true } : i,
              ),
            }
          : prev,
      );
    } catch (err) {
      notify.error(getErrorMessage(err));
    }
  }

  if (reposQuery.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-white/40">
        <Spinner />
        <span className="ml-2 text-sm">Loading…</span>
      </div>
    );
  }

  if (!reposQuery.data?.connected) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-white/50"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-white/70">
          Connect your GitHub account
        </p>
        <p className="mt-1 mb-4 max-w-xs text-xs text-white/35">
          Install the app on your repositories to review their pull requests.
        </p>
        <button
          onClick={connectGithub}
          className="cursor-pointer rounded-xl bg-linear-to-r from-violet-300 to-indigo-300 px-5 py-2 text-sm font-semibold text-black transition hover:from-violet-200 hover:to-indigo-200 active:scale-[0.98]"
        >
          Connect GitHub
        </button>
      </div>
    );
  }

  const repos = reposQuery.data.repos;
  const canPost =
    review?.status === "completed" &&
    review.issues.some((i) => i.included && !i.posted);

  return (
    <div className="flex flex-1 gap-4 overflow-hidden">
      <section className="flex w-2/5 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0f]">
        <div className="border-b border-white/10 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-white/40">Repository</span>
            <div className="flex items-center gap-3">
              <button
                onClick={refreshRepos}
                title="Refresh repositories"
                className="text-white/40 transition hover:text-white/80"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 4v6h-6" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </button>
              {manageUrl && (
                <a
                  href={manageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-violet-300 transition hover:text-violet-200"
                >
                  Manage access ↗
                </a>
              )}
            </div>
          </div>
          <select
            value={selectedRepoId ?? ""}
            onChange={(e) => {
              setSelectedRepoId(e.target.value || null);
              setReview(null);
            }}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-violet-300/60"
          >
            <option value="">Select a repository…</option>
            {repos.map((repo) => (
              <option key={repo.id} value={repo.id} className="bg-[#0b0b0f]">
                {repo.fullName}
                {repo.isPrivate ? " (private)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-auto p-3">
          {!selectedRepoId ? (
            <p className="mt-8 text-center text-xs text-white/35">
              Pick a repository to see its open pull requests.
            </p>
          ) : pullsQuery.isLoading ? (
            <div className="mt-8 flex justify-center text-white/40">
              <Spinner />
            </div>
          ) : (pullsQuery.data?.length ?? 0) === 0 ? (
            <p className="mt-8 text-center text-xs text-white/35">
              No open pull requests.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {pullsQuery.data?.map((pr) => (
                <div
                  key={pr.number}
                  className="rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <span className="text-sm font-medium text-white/90">
                      #{pr.number} {pr.title}
                    </span>
                  </div>
                  <p className="mb-2 text-xs text-white/40">
                    {pr.author ?? "unknown"} · {pr.headBranch} → {pr.baseBranch}
                  </p>
                  <button
                    onClick={() => runReview(pr.number)}
                    disabled={reviewingPr !== null}
                    className="flex items-center gap-2 rounded-lg bg-violet-400/15 px-3 py-1.5 text-xs font-medium text-violet-200 transition hover:bg-violet-400/25 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {reviewingPr === pr.number ? (
                      <>
                        <Spinner /> Reviewing…
                      </>
                    ) : (
                      "Run review"
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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
              Run a review on a pull request to see the findings here.
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
    </div>
  );
}

export default PrReview;

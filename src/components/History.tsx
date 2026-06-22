import { useEffect, useState } from "react";
import { useReviews, useReview } from "../hooks/useGithub";
import Spinner from "./Spinner";
import ReviewDetail from "./ReviewDetail";
import type { Review } from "../types/github";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })} ${d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function statusStyle(status: string): string {
  if (status === "completed") return "bg-emerald-500/15 text-emerald-300";
  if (status === "failed") return "bg-red-500/15 text-red-300";
  return "bg-white/10 text-white/60";
}

function History() {
  const reviewsQuery = useReviews();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const reviewQuery = useReview(selectedId);
  const [review, setReview] = useState<Review | null>(null);

  useEffect(() => {
    if (reviewQuery.data) setReview(reviewQuery.data);
  }, [reviewQuery.data]);

  function select(id: string) {
    setSelectedId(id);
    setReview(null);
  }

  return (
    <div className="flex flex-1 gap-4 overflow-hidden">
      <section className="flex w-2/5 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0f]">
        <div className="border-b border-white/10 px-4 py-3 text-sm font-semibold">
          Review history
        </div>
        <div className="flex-1 overflow-auto p-3">
          {reviewsQuery.isLoading ? (
            <div className="mt-8 flex justify-center text-white/40">
              <Spinner />
            </div>
          ) : (reviewsQuery.data?.length ?? 0) === 0 ? (
            <p className="mt-8 text-center text-xs text-white/35">
              No reviews yet. Run one from PR Review.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {reviewsQuery.data?.map((r) => (
                <button
                  key={r.id}
                  onClick={() => select(r.id)}
                  className={`rounded-xl border p-3 text-left transition ${
                    selectedId === r.id
                      ? "border-violet-300/40 bg-violet-400/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-white/90">
                      {r.repoFullName}
                    </span>
                    <span className="flex-shrink-0 text-xs text-white/35">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>
                  <p className="mb-1.5 truncate text-xs text-white/50">
                    #{r.prNumber} {r.prTitle}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${statusStyle(r.status)}`}
                    >
                      {r.status}
                    </span>
                    <span className="text-[11px] text-white/40">
                      {r.issueCount} issue{r.issueCount === 1 ? "" : "s"}
                    </span>
                    {r.isPosted && (
                      <span className="rounded-md bg-violet-500/15 px-2 py-0.5 text-[11px] font-medium text-violet-300">
                        posted to PR
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <ReviewDetail
        review={review}
        emptyMessage={
          selectedId
            ? "Loading review…"
            : "Select a review from the list to view its findings."
        }
        onReviewChange={setReview}
      />
    </div>
  );
}

export default History;

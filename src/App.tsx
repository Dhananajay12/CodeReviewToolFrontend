import { lazy, Suspense, useState } from "react";
import LoginModal from "./components/LoginModal";
import Sidebar, { type AppView } from "./components/Sidebar";
import { useAuth } from "./hooks/useAuth";

const CodeReview = lazy(() => import("./components/CodeReview"));
const PrReview = lazy(() => import("./components/PrReview"));
const History = lazy(() => import("./components/History"));

function ViewFallback() {
  return (
    <div className="flex flex-1 items-center justify-center text-white/40">
      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
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
    </div>
  );
}

function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [view, setView] = useState<AppView>("code");

  const { data: user } = useAuth();

  return (
    <div className="flex h-full bg-linear-to-br from-[#09090d] via-[#0c0c12] to-[#101018] text-white">
      {user && <Sidebar user={user} view={view} onNavigate={setView} />}

      <div className="flex flex-1 flex-col overflow-hidden">
        {!user && (
          <header className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-violet-400 to-indigo-500 shadow-lg shadow-indigo-500/30">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-semibold tracking-tight">
                  AI Code Review
                </h1>
                <p className="text-xs text-white/40">
                  Instant, intelligent feedback on your code
                </p>
              </div>
            </div>

            <button
              onClick={() => setLoginOpen(true)}
              className="cursor-pointer group flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur transition hover:border-violet-300/50 hover:bg-white/10"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-violet-300"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Login
            </button>
          </header>
        )}

        <main
          className={`flex flex-1 gap-4 overflow-hidden px-6 pb-6 ${
            user ? "pt-6" : ""
          }`}
        >
          <Suspense fallback={<ViewFallback />}>
            {user && view === "pr" ? (
              <PrReview />
            ) : user && view === "history" ? (
              <History />
            ) : (
              <CodeReview />
            )}
          </Suspense>
        </main>
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import SimpleCodeEditor from "react-simple-code-editor";
import LoginModal from "./components/LoginModal";
import "prismjs/themes/prism-tomorrow.css";
import "highlight.js/styles/github-dark.css";
import AxiosInstance from "./helpers/interceptor";

type ModuleWithDefault<T> = T & {
  default?: T;
};

const editorModule = SimpleCodeEditor as ModuleWithDefault<
  typeof SimpleCodeEditor
>;

const Editor = editorModule.default ?? editorModule;

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`);

  const [review, setReview] = useState(``);
  const [loading, setLoading] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    try {
      setLoading(true);
      const response = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/ai/get-review`,
        {
          code,
        },
      );

      setReview(response.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col bg-linear-to-br from-[#09090d] via-[#0c0c12] to-[#101018] text-white">
      {/* Header */}
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
          Review your PR
        </button>
      </header>

      {/* Main */}
      <main className="flex flex-1 gap-4 overflow-hidden px-6 pb-6">
        {/* Editor card */}
        <section className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0f] shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="text-xs font-medium text-white/40">script.js</span>
            <span className="rounded-md bg-violet-400/10 px-2 py-0.5 text-[11px] font-medium text-violet-300">
              JavaScript
            </span>
          </div>

          <div className="flex-1 overflow-auto font-mono text-[15px] [&_pre]:!bg-transparent [&_textarea]:outline-none">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={16}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 15,
                minHeight: "100%",
              }}
            />
          </div>

          <div className="flex justify-end border-t border-white/10 px-4 py-3">
            <button
              onClick={reviewCode}
              disabled={loading}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-r from-violet-300 to-indigo-300 px-5 py-2 text-sm font-semibold text-black shadow-lg shadow-violet-500/20 transition hover:from-violet-200 hover:to-indigo-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
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
                  Reviewing
                </>
              ) : (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                  Review
                </>
              )}
            </button>
          </div>
        </section>

        {/* Output card */}
        <section className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f14] shadow-2xl shadow-black/40">
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-violet-300"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span className="text-sm font-semibold">Review</span>
          </div>

          <div className="flex-1 overflow-auto px-6 py-5">
            {review ? (
              <div className="text-[15px] leading-relaxed text-white/85 [&_a]:text-violet-300 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px] [&_h1]:mb-3 [&_h1]:mt-1 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:font-semibold [&_li]:mb-1 [&_p]:mb-3 [&_pre]:my-3 [&_pre]:overflow-auto [&_pre]:rounded-xl [&_pre]:bg-black/40 [&_pre]:p-4 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5">
                <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white/40"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-white/60">
                  No review yet
                </p>
                <p className="mt-1 max-w-xs text-xs text-white/35">
                  Write or paste your code on the left and hit{" "}
                  <span className="text-violet-300">Review</span> to get
                  AI-powered feedback.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}

export default App;

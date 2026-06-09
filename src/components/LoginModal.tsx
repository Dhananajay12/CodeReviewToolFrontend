import { useState } from "react";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
};

function LoginModal({ open, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire up to backend auth endpoint
    console.log("login with", { email, password });
  }

  function handleGoogleLogin() {
    // TODO: wire up Google OAuth flow
    console.log("login with Google");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-overlay-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c11] p-7 text-white shadow-2xl shadow-black/60 animate-modal-in"
      >
        {/* Glow accent */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />

        <button
          onClick={onClose}
          aria-label="Close login dialog"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/10 hover:text-white"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="relative mb-6 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-violet-400 to-indigo-500 shadow-lg shadow-indigo-500/30">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <h2 id="login-title" className="text-xl font-semibold">
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-white/45">
            Sign in to review your PR
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="relative flex w-full items-center justify-center gap-2.5 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-100 active:scale-[0.99]"
        >
          <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001 6.19 5.238 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-white/30">
          <span className="h-px flex-1 bg-white/10" />
          or
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-white/60">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-violet-300/60 focus:ring-2 focus:ring-violet-300/15"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-white/60">Password</span>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 pr-16 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-violet-300/60 focus:ring-2 focus:ring-violet-300/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 rounded-md px-2 py-1 text-xs font-medium text-white/40 transition hover:text-violet-300"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <div className="-mt-1 flex justify-end">
            <a
              href="#"
              className="text-xs text-white/45 transition hover:text-violet-300"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="mt-1 w-full rounded-xl bg-linear-to-r from-violet-300 to-indigo-300 px-4 py-2.5 text-sm font-semibold text-black shadow-lg shadow-violet-500/20 transition hover:from-violet-200 hover:to-indigo-200 active:scale-[0.99]"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/45">
          Don't have an account?{" "}
          <a
            href="#"
            className="font-medium text-violet-300 transition hover:text-violet-200"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;

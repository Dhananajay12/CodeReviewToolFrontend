import { useState } from "react";
import { useLogout } from "../hooks/useAuth";
import { notify, getErrorMessage } from "../helpers/toast";
import SettingsModal from "./SettingsModal";
import type { CurrentUser } from "../types/auth";

export type AppView = "code" | "pr";

type SidebarProps = {
  user: CurrentUser;
  view: AppView;
  onNavigate: (view: AppView) => void;
};

const COLLAPSE_KEY = "sidebar:collapsed";

function Sidebar({ user, view, onNavigate }: SidebarProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(
    () => localStorage.getItem(COLLAPSE_KEY) === "true",
  );
  const logoutMutation = useLogout();

  const displayName = user.name?.trim() || user.email;
  const initial = displayName.charAt(0).toUpperCase();

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_KEY, String(next));
      return next;
    });
  }

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync();
      notify.success("Logged out");
    } catch (err) {
      notify.error(getErrorMessage(err));
    }
  }

  return (
    <aside
      className={`flex h-full flex-shrink-0 flex-col border-r border-white/10 bg-[#0b0b0f] py-4 transition-[width] duration-200 ${
        collapsed ? "w-16 px-2" : "w-64 px-3"
      }`}
    >
      <div
        className={`pb-5 ${
          collapsed
            ? "flex flex-col items-center gap-2"
            : "flex items-center gap-3 px-2"
        }`}
      >
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-400 to-indigo-500 shadow-lg shadow-indigo-500/30">
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
        {!collapsed && (
          <span className="flex-1 truncate text-sm font-semibold tracking-tight text-white">
            AI Code Review
          </span>
        )}
        <button
          type="button"
          onClick={toggleCollapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/10 hover:text-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      <nav className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => onNavigate("code")}
          aria-current={view === "code" ? "page" : undefined}
          title={collapsed ? "Code Review" : undefined}
          className={`flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition ${
            collapsed ? "justify-center px-0" : "px-3"
          } ${
            view === "code"
              ? "bg-violet-400/10 text-violet-200"
              : "text-white/60 hover:bg-white/5 hover:text-white/90"
          }`}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          {!collapsed && "Code Review"}
        </button>

        <button
          type="button"
          onClick={() => onNavigate("pr")}
          aria-current={view === "pr" ? "page" : undefined}
          title={collapsed ? "PR Review" : undefined}
          className={`flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition ${
            collapsed ? "justify-center px-0" : "px-3"
          } ${
            view === "pr"
              ? "bg-violet-400/10 text-violet-200"
              : "text-white/60 hover:bg-white/5 hover:text-white/90"
          }`}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <path d="M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <path d="M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <path d="M6 9v12" />
            <path d="M18 6a9 9 0 0 1-9 9" />
          </svg>
          {!collapsed && "PR Review"}
        </button>
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-white/10 pt-3">
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          title={collapsed ? "Settings" : undefined}
          className={`group flex items-center gap-3 rounded-xl py-2 text-left transition hover:bg-white/5 ${
            collapsed ? "justify-center px-0" : "px-2"
          }`}
        >
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-linear-to-br from-violet-400 to-indigo-500 text-sm font-semibold text-white">
            {initial}
          </span>
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-white/90">
                  {displayName}
                </span>
                <span className="block truncate text-xs text-white/40">
                  {user.email}
                </span>
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0 text-white/30 transition group-hover:text-white/70"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          title={collapsed ? "Logout" : undefined}
          className={`flex items-center gap-3 rounded-xl py-2 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60 ${
            collapsed ? "justify-center px-0" : "px-3"
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {!collapsed && (logoutMutation.isPending ? "Logging out…" : "Logout")}
        </button>
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
      />
    </aside>
  );
}

export default Sidebar;

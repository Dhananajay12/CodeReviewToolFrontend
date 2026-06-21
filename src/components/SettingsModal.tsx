import { useState } from "react";
import { useUpdateProfile, useChangePassword } from "../hooks/useAuth";
import { notify, getErrorMessage } from "../helpers/toast";
import type { CurrentUser } from "../types/auth";

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
  user: CurrentUser;
};

function SettingsModal({ open, onClose, user }: SettingsModalProps) {
  const [name, setName] = useState(user.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  if (!open) return null;

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({ name: name.trim() });
      notify.success("Profile updated");
      onClose();
    } catch (err) {
      notify.error(getErrorMessage(err));
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      notify.success("Password changed");
      setCurrentPassword("");
      setNewPassword("");
      onClose();
    } catch (err) {
      notify.error(getErrorMessage(err));
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-violet-300/60 focus:ring-2 focus:ring-violet-300/15 disabled:opacity-50";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-overlay-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c11] p-7 text-white shadow-2xl shadow-black/60 animate-modal-in"
      >
        <button
          onClick={onClose}
          aria-label="Close settings"
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

        <h2 id="settings-title" className="mb-6 text-xl font-semibold">
          Settings
        </h2>

        <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-white/60">
              Display name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-white/60">Email</span>
            <input type="email" value={user.email} disabled className={inputClass} />
          </label>

          <button
            type="submit"
            disabled={updateProfile.isPending || name.trim().length === 0}
            className="self-start rounded-xl bg-linear-to-r from-violet-300 to-indigo-300 px-4 py-2 text-sm font-semibold text-black transition hover:from-violet-200 hover:to-indigo-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updateProfile.isPending ? "Saving…" : "Save profile"}
          </button>
        </form>

        {user.hasPassword ? (
          <>
            <div className="my-6 h-px bg-white/10" />
            <form
              onSubmit={handlePasswordSave}
              className="flex flex-col gap-4"
            >
              <h3 className="text-sm font-semibold text-white/80">
                Change password
              </h3>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-white/60">
                  Current password
                </span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-white/60">
                  New password
                </span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className={inputClass}
                />
              </label>
              <button
                type="submit"
                disabled={
                  changePassword.isPending ||
                  currentPassword.length === 0 ||
                  newPassword.length < 8
                }
                className="self-start rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {changePassword.isPending ? "Updating…" : "Update password"}
              </button>
            </form>
          </>
        ) : (
          <p className="mt-6 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white/45">
            You signed in with Google, so there's no password to change.
          </p>
        )}
      </div>
    </div>
  );
}

export default SettingsModal;

"use client";

import { useState } from "react";
import { deleteUser } from "@/app/actions/admin";
import type { AdminUser } from "@/app/(admin)/admin/page";

interface AdminUserManagerProps {
  initialUsers: AdminUser[];
}

export default function AdminUserManager({ initialUsers }: AdminUserManagerProps): React.ReactElement {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? users.filter(
        (u) =>
          u.display_name.toLowerCase().includes(search.toLowerCase()) ||
          (u.email ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : users;

  async function handleDeleteUser(userId: string): Promise<void> {
    setDeletingId(userId);
    setError(null);
    const result = await deleteUser(userId);
    setDeletingId(null);
    setConfirmDeleteId(null);

    if (!result.ok) {
      setError(result.error ?? "Delete failed");
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Admin — Users</h1>
        <span className="text-sm text-gray-400">{users.length} total</span>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
      />

      {error && (
        <p className="text-sm text-red-600 font-medium bg-red-50 px-3 py-2 rounded">{error}</p>
      )}

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">No users found</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((user) => {
            const isConfirming = confirmDeleteId === user.id;
            const isDeleting = deletingId === user.id;

            return (
              <div
                key={user.id}
                className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center gap-3"
              >
                {/* Avatar initial */}
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                  {user.display_name.charAt(0).toUpperCase()}
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.display_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {user.email ?? "no email"}
                    {" · "}
                    <span className="capitalize">{user.provider}</span>
                    {" · "}
                    {new Date(user.created_at).toLocaleDateString("he-IL")}
                  </p>
                </div>

                {/* Delete controls */}
                {isConfirming ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-red-600">Delete user + all data?</span>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={isDeleting}
                      className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {isDeleting ? "…" : "Delete"}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(user.id)}
                    className="shrink-0 text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

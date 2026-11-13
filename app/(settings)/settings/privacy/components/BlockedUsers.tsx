"use client";

import { Search, ShieldCheck, UserRound, UserRoundX, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { toggleBlock } from "@/app/actions/profile/connections.action";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface BlockedUser {
  id: string;
  name: string;
  username: string;
  image?: string;
}

export default function BlockedUsers({ users }: { users: BlockedUser[] }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<BlockedUser | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query),
    );
  }, [users, search]);

  const handleUnblock = async () => {
    if (!selectedUser) return;

    setLoading(true);

    try {
      const result = await toggleBlock(selectedUser.username);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setSelectedUser(null);
      router.refresh();
    } catch {
      toast.error("Failed to unblock user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="overflow-hidden rounded-xl border border-border bg-app-card">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-app-primary/10 text-app-primary">
              <UserRoundX className="size-4.5" />
            </div>

            <div>
              <h2 className="text-sm font-semibold">Blocked Users</h2>
              <p className="text-xs text-muted-foreground">
                {users.length} {users.length === 1 ? "user" : "users"} blocked
              </p>
            </div>
          </div>

          {users.length > 0 && (
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or username..."
                className="h-9 w-full rounded-lg border border-border bg-app-background pl-9 pr-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-app-primary"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* User List */}
        {filteredUsers.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-app-background/50 sm:px-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="size-10 shrink-0">
                    <AvatarImage
                      src={user.image || undefined}
                      alt={user.name}
                    />

                    <AvatarFallback>
                      {user.name?.charAt(0)?.toUpperCase() || (
                        <UserRound className="size-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={() => setSelectedUser(user)}
                  className="h-8 shrink-0 px-3 text-xs cursor-pointer"
                >
                  Unblock
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={search ? Search : ShieldCheck}
            title={search ? "No users found" : "No blocked users"}
            description={
              search
                ? "No blocked users match your search. Try another name or username."
                : "You haven't blocked anyone. Users you block will appear here."
            }
            action={
              search ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSearch("")}
                >
                  Clear search
                </Button>
              ) : undefined
            }
          />
        )}
      </section>

      <ConfirmDialog
        open={!!selectedUser}
        onOpenChange={(open) => {
          if (!open && !loading) setSelectedUser(null);
        }}
        title="Unblock this user?"
        description={`Are you sure you want to unblock ${selectedUser?.name ?? "this user"}? They will be able to follow you again. Previous follow relationships will not be restored automatically.`}
        confirmText="Unblock User"
        cancelText="Keep Blocked"
        loading={loading}
        onConfirm={handleUnblock}
      />
    </>
  );
}

export default function ProfileStats({
  followersCount,
  followingCount,
  donationsCount,
}: {
  followersCount: number;
  followingCount: number;
  donationsCount: number;
}) {
  return (
    <div className="relative mt-6 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-app-background p-3 text-center">
      <div className="px-2">
        <p className="text-xs text-app-muted">Followers</p>
        <p className="mt-0.5 text-base font-bold text-app-foreground">
          {followersCount || 0}
        </p>
      </div>

      <div className="px-2">
        <p className="text-xs text-app-muted">Following</p>
        <p className="mt-0.5 text-base font-bold text-app-foreground">
          {followingCount || 0}
        </p>
      </div>

      <div className="px-2">
        <p className="text-xs text-app-muted">Donations</p>
        <p className="mt-0.5 text-base font-bold text-app-primary">
          {donationsCount || 0}
        </p>
      </div>
    </div>
  );
}

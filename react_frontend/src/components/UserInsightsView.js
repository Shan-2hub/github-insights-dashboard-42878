import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  CartesianGrid,
} from "recharts";
import { CheckCircle2, Link as LinkIcon, MapPin, Twitter, Star, Flame, StickyNote } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

/**
 * Attempt to normalize the backend response shape.
 * Backend scaffolding may evolve; this keeps the UI resilient.
 */
function normalizePayload(payload) {
  const profile = payload?.profile ?? payload?.user ?? payload?.data?.profile ?? payload?.data?.user ?? payload ?? {};
  const username = profile?.login ?? profile?.username ?? payload?.username ?? "";
  const avatarUrl = profile?.avatar_url ?? profile?.avatarUrl ?? "";
  const name = profile?.name ?? "";
  const bio = profile?.bio ?? "";
  const followers = profile?.followers ?? 0;
  const following = profile?.following ?? 0;
  const publicGists = profile?.public_gists ?? profile?.publicGists ?? profile?.public_gists_count ?? 0;

  // Stats
  const totalStars =
    profile?.total_stars ??
    payload?.total_stars ??
    payload?.stats?.total_stars ??
    payload?.stats?.totalStars ??
    0;

  const contributionStreak =
    profile?.contribution_streak ??
    payload?.contribution_streak ??
    payload?.stats?.contribution_streak ??
    payload?.stats?.contributionStreak ??
    null;

  // Languages may come as dict, array, or already chart-ready
  const topLanguagesRaw =
    profile?.top_languages ?? payload?.top_languages ?? payload?.stats?.top_languages ?? payload?.stats?.topLanguages ?? {};

  const events = payload?.recent_activity ?? payload?.events ?? payload?.activity ?? [];

  return {
    profile: {
      username,
      name,
      bio,
      avatarUrl,
      followers,
      following,
      publicGists,
      location: profile?.location ?? "",
      blog: profile?.blog ?? "",
      twitter: profile?.twitter_username ?? profile?.twitter ?? "",
      htmlUrl: profile?.html_url ?? profile?.htmlUrl ?? "",
    },
    stats: {
      totalStars,
      contributionStreak,
    },
    topLanguagesRaw,
    events,
  };
}

function formatRelativeTime(isoOrEpoch) {
  if (!isoOrEpoch) return "—";
  const d = typeof isoOrEpoch === "number" ? new Date(isoOrEpoch) : new Date(isoOrEpoch);
  if (Number.isNaN(d.getTime())) return "—";

  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.max(1, Math.floor(diffMs / 1000));
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay > 0) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  if (diffHr > 0) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  if (diffMin > 0) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  return `${diffSec} second${diffSec === 1 ? "" : "s"} ago`;
}

function normalizeLanguages(topLanguagesRaw) {
  // Map/dict case: { "JavaScript": 1234, "Python": 900 }
  if (topLanguagesRaw && !Array.isArray(topLanguagesRaw) && typeof topLanguagesRaw === "object") {
    return Object.entries(topLanguagesRaw)
      .filter(([, v]) => typeof v === "number")
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  }

  // Array case: [{name,value}] or [{language,count}]
  if (Array.isArray(topLanguagesRaw)) {
    return topLanguagesRaw
      .map((x) => ({
        name: x?.name ?? x?.language ?? "Unknown",
        value: x?.value ?? x?.count ?? x?.bytes ?? 0,
      }))
      .filter((x) => typeof x.value === "number")
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }

  return [];
}

// GitHub-like language palette
const LANG_COLORS = [
  "#f1e05a",
  "#3178c6",
  "#e34c26",
  "#701516",
  "#563d7c",
  "#178600",
  "#3572A5",
  "#00ADD8",
];

// PUBLIC_INTERFACE
export default function UserInsightsView({ payload, isFetching }) {
  /** Renders the user insight dashboard section (header + bento layout with charts). */
  const normalized = normalizePayload(payload);
  const langs = normalizeLanguages(normalized.topLanguagesRaw);

  const verified = (normalized.profile.followers ?? 0) >= 500;

  // Activity summary for charts (admin/global uses more, but public view keeps it light)
  const activityBars = useMemo(() => {
    const buckets = {};
    for (const e of normalized.events ?? []) {
      const type = e?.type ?? e?.event_type ?? "Event";
      buckets[type] = (buckets[type] || 0) + 1;
    }
    return Object.entries(buckets)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [normalized.events]);

  if (isFetching) return <InsightsDashboardSkeleton />;

  return (
    <div>
      <UserHeader profile={normalized.profile} verified={verified} />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="bento">
            <Card>
              <CardContent>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <h3 style={{ margin: 0 }}>Language Distribution</h3>
                    <p className="p" style={{ marginTop: 6 }}>
                      Top languages inferred from repositories (cached by backend).
                    </p>
                  </div>
                  <div className="badge">Recharts</div>
                </div>

                <div style={{ height: 280, marginTop: 12 }}>
                  {langs.length === 0 ? (
                    <div className="p" style={{ marginTop: 12 }}>
                      No language data available for this user.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={langs} dataKey="value" nameKey="name" innerRadius={72} outerRadius={110} paddingAngle={3}>
                          {langs.map((_, idx) => (
                            <Cell key={idx} fill={LANG_COLORS[idx % LANG_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "rgba(2,6,23,0.92)",
                            border: "1px solid rgba(30,41,59,0.9)",
                            borderRadius: 12,
                            color: "rgba(255,255,255,0.92)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {langs.length > 0 && (
                  <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {langs.map((l, idx) => (
                      <span key={l.name} className="badge">
                        <span
                          aria-hidden="true"
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 99,
                            background: LANG_COLORS[idx % LANG_COLORS.length],
                            display: "inline-block",
                          }}
                        />
                        {l.name}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="bento-right">
              <StatTile
                title="Total Stars"
                icon={Star}
                value={normalized.stats.totalStars ?? 0}
                subtitle="Across public repos"
              />
              <StatTile
                title="Contribution Streak"
                icon={Flame}
                value={normalized.stats.contributionStreak ?? "—"}
                subtitle="(placeholder if backend doesn’t provide)"
              />
              <StatTile title="Public Gists" icon={StickyNote} value={normalized.profile.publicGists ?? 0} subtitle="GitHub profile" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <div className="bento">
            <Card>
              <CardContent>
                <h3 style={{ margin: 0 }}>Recent Activity</h3>
                <p className="p" style={{ marginTop: 6 }}>
                  Timeline is approximated from recent public events (when available).
                </p>

                <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                  {(normalized.events ?? []).slice(0, 10).map((e, idx) => (
                    <TimelineItem key={idx} event={e} />
                  ))}

                  {(normalized.events ?? []).length === 0 && (
                    <div className="p" style={{ marginTop: 8 }}>
                      No recent activity available.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 style={{ margin: 0 }}>Activity Types</h3>
                <p className="p" style={{ marginTop: 6 }}>
                  High-level distribution of event types.
                </p>
                <div style={{ height: 280, marginTop: 12 }}>
                  {activityBars.length === 0 ? (
                    <div className="p" style={{ marginTop: 12 }}>
                      No activity data available.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activityBars} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: "rgba(2,6,23,0.92)",
                            border: "1px solid rgba(30,41,59,0.9)",
                            borderRadius: 12,
                            color: "rgba(255,255,255,0.92)",
                          }}
                        />
                        <Bar dataKey="count" fill="rgba(245,158,11,0.85)" radius={[10, 10, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UserHeader({ profile, verified }) {
  return (
    <div className="card" style={{ marginTop: 18 }}>
      <div className="card-inner" style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <img
          src={profile.avatarUrl}
          alt={`${profile.username} avatar`}
          width={64}
          height={64}
          style={{
            borderRadius: 16,
            border: "1px solid rgba(30,41,59,0.9)",
            boxShadow: "0 14px 45px rgba(0,0,0,0.55)",
          }}
        />

        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h2 style={{ margin: 0, letterSpacing: -0.2 }}>
              {profile.name || profile.username || "User"}
              {profile.username && profile.name ? (
                <span style={{ marginLeft: 10, color: "rgba(255,255,255,0.65)", fontSize: 14 }}>@{profile.username}</span>
              ) : null}
            </h2>

            {verified ? (
              <span className="badge badge-verified">
                <CheckCircle2 size={14} /> Verified
              </span>
            ) : (
              <span className="badge">Standard</span>
            )}
          </div>

          {profile.bio ? (
            <p className="p" style={{ marginTop: 8 }}>
              {profile.bio}
            </p>
          ) : (
            <p className="p" style={{ marginTop: 8 }}>
              No bio provided.
            </p>
          )}

          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 10 }}>
            <span className="badge">
              <strong>{profile.followers ?? 0}</strong> followers
            </span>
            <span className="badge">
              <strong>{profile.following ?? 0}</strong> following
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gap: 10, minWidth: 220 }}>
          {profile.location ? (
            <a className="badge" href={`https://www.google.com/maps/search/${encodeURIComponent(profile.location)}`} target="_blank" rel="noreferrer">
              <MapPin size={14} /> {profile.location}
            </a>
          ) : null}

          {profile.blog ? (
            <a className="badge" href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noreferrer">
              <LinkIcon size={14} /> Blog
            </a>
          ) : null}

          {profile.twitter ? (
            <a className="badge" href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noreferrer">
              <Twitter size={14} /> @{profile.twitter}
            </a>
          ) : null}

          {profile.htmlUrl ? (
            <a className="badge" href={profile.htmlUrl} target="_blank" rel="noreferrer">
              <LinkIcon size={14} /> GitHub Profile
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StatTile({ title, icon: Icon, value, subtitle }) {
  return (
    <Card>
      <CardContent>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div className="badge">
              <Icon size={14} /> {title}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.4, marginTop: 10 }}>{String(value)}</div>
            <div className="p" style={{ marginTop: 6 }}>
              {subtitle}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TimelineItem({ event }) {
  const type = event?.type ?? event?.event_type ?? "Event";
  const message =
    event?.message ??
    event?.payload?.commits?.[0]?.message ??
    event?.payload?.comment?.body ??
    event?.repo?.name ??
    "Activity event";
  const when = event?.created_at ?? event?.createdAt ?? event?.timestamp ?? event?.time;

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 14,
        border: "1px solid rgba(30,41,59,0.9)",
        background: "rgba(2,6,23,0.25)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div className="badge">{type}</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>{formatRelativeTime(when)}</div>
      </div>
      <div style={{ marginTop: 8, fontWeight: 650 }}>{message}</div>
    </div>
  );
}

function InsightsDashboardSkeleton() {
  return (
    <div aria-label="Loading insights dashboard">
      <div className="card" style={{ marginTop: 18 }}>
        <div className="card-inner" style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <Skeleton style={{ width: 64, height: 64, borderRadius: 16 }} />
          <div style={{ flex: 1, minWidth: 240 }}>
            <Skeleton style={{ width: "45%", height: 18, marginBottom: 10 }} />
            <Skeleton style={{ width: "80%", height: 14, marginBottom: 8 }} />
            <Skeleton style={{ width: "60%", height: 14 }} />
            <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Skeleton style={{ width: 100, height: 24, borderRadius: 999 }} />
              <Skeleton style={{ width: 100, height: 24, borderRadius: 999 }} />
            </div>
          </div>
          <div style={{ display: "grid", gap: 10, minWidth: 220 }}>
            <Skeleton style={{ width: "100%", height: 26, borderRadius: 999 }} />
            <Skeleton style={{ width: "100%", height: 26, borderRadius: 999 }} />
          </div>
        </div>
      </div>

      <div className="bento" aria-label="Loading insights tiles">
        <Card>
          <CardContent>
            <Skeleton style={{ width: "38%", height: 16, marginBottom: 10 }} />
            <Skeleton style={{ width: "100%", height: 280 }} />
          </CardContent>
        </Card>

        <div className="bento-right">
          <Card>
            <CardContent>
              <Skeleton style={{ width: "55%", height: 16, marginBottom: 10 }} />
              <Skeleton style={{ width: "70%", height: 34, marginBottom: 8 }} />
              <Skeleton style={{ width: "85%", height: 14 }} />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Skeleton style={{ width: "60%", height: 16, marginBottom: 10 }} />
              <Skeleton style={{ width: "70%", height: 34, marginBottom: 8 }} />
              <Skeleton style={{ width: "85%", height: 14 }} />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Skeleton style={{ width: "50%", height: 16, marginBottom: 10 }} />
              <Skeleton style={{ width: "70%", height: 34, marginBottom: 8 }} />
              <Skeleton style={{ width: "85%", height: 14 }} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

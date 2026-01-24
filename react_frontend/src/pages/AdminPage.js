import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Shield, Activity, Lock } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LineChart,
  Line,
} from "recharts";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

import { getAdminHistory, getAdminStats } from "../lib/api";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";

function normalizeTopLanguages(topLanguages) {
  if (Array.isArray(topLanguages)) {
    return topLanguages
      .map((x) => ({
        name: x?.name ?? x?.language ?? "Unknown",
        value: x?.value ?? x?.count ?? x?.bytes ?? 0,
      }))
      .filter((x) => typeof x.value === "number")
      .slice(0, 10);
  }

  if (topLanguages && typeof topLanguages === "object") {
    return Object.entries(topLanguages)
      .map(([name, value]) => ({ name, value }))
      .filter((x) => typeof x.value === "number")
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }

  return [];
}

function normalizeHistoryRows(historyPayload) {
  // expected: array of {username_searched, searched_at, location?}
  if (Array.isArray(historyPayload)) return historyPayload;

  if (Array.isArray(historyPayload?.items)) return historyPayload.items;
  if (Array.isArray(historyPayload?.history)) return historyPayload.history;
  return [];
}

function formatTime(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

// PUBLIC_INTERFACE
export default function AdminPage() {
  /**
   * Admin portal.
   * Route protection will be enforced later (auth layer). For now we show a placeholder guard banner.
   */
  const stats = useQuery({ queryKey: ["admin", "stats"], queryFn: getAdminStats });
  const history = useQuery({ queryKey: ["admin", "history"], queryFn: getAdminHistory });

  const loading = stats.isFetching || history.isFetching;

  const topLangChart = useMemo(() => normalizeTopLanguages(stats.data?.top_languages), [stats.data?.top_languages]);
  const historyRows = useMemo(() => normalizeHistoryRows(history.data), [history.data]);

  const historyChart = useMemo(() => {
    // simple per-day counts
    const counts = new Map();
    for (const row of historyRows) {
      const d = new Date(row?.searched_at ?? row?.searchedAt ?? row?.timestamp ?? row?.created_at);
      if (Number.isNaN(d.getTime())) continue;
      const key = d.toISOString().slice(0, 10);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-14)
      .map(([date, count]) => ({ date, count }));
  }, [historyRows]);

  const columns = useMemo(
    () => [
      {
        header: "User Searched",
        accessorKey: "username_searched",
        cell: (info) => info.getValue() ?? info.row.original?.username ?? "—",
      },
      {
        header: "Timestamp",
        accessorKey: "searched_at",
        cell: (info) =>
          formatTime(
            info.getValue() ??
              info.row.original?.searchedAt ??
              info.row.original?.timestamp ??
              info.row.original?.created_at
          ),
      },
      {
        header: "Location",
        accessorKey: "location",
        cell: (info) => info.getValue() ?? info.row.original?.ip_location ?? info.row.original?.geo ?? "—",
      },
    ],
    []
  );

  const table = useReactTable({
    data: historyRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <div className="brand">
            <Shield size={18} />
            <span>Admin Portal</span>
            <span className="badge">
              <Activity size={14} /> System + Search History
            </span>
          </div>
          <Button asChild href="/">
            Back
          </Button>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-inner" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <span className="badge" style={{ borderColor: "rgba(245,158,11,0.35)" }}>
              <Lock size={14} /> Protected route (placeholder)
            </span>
            <div className="p">
              Add auth later; until then this view is visible for development and QA.
            </div>
          </div>
        </div>

        {loading ? (
          <AdminSkeleton />
        ) : (
          <>
            <div className="bento">
              <Card>
                <CardContent>
                  <h3 style={{ margin: 0 }}>System Health</h3>
                  <p className="p" style={{ marginTop: 6 }}>
                    GitHub API rate limit remaining:{" "}
                    <strong>{stats.data?.rate_limit_remaining ?? "—"}</strong>
                  </p>

                  <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <span className="badge">Limit: {stats.data?.rate_limit_limit ?? "—"}</span>
                    <span className="badge">Reset: {formatTime(stats.data?.rate_limit_reset ?? null)}</span>
                  </div>

                  <div style={{ height: 220, marginTop: 12 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: "Rate Limit",
                            remaining: Number(stats.data?.rate_limit_remaining ?? 0),
                            used: Number(stats.data?.rate_limit_used ?? 0),
                          },
                        ]}
                      >
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
                        <Bar dataKey="remaining" fill="rgba(5,150,105,0.85)" radius={[10, 10, 0, 0]} />
                        <Bar dataKey="used" fill="rgba(245,158,11,0.8)" radius={[10, 10, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <h3 style={{ margin: 0 }}>Global Insights</h3>
                  <p className="p" style={{ marginTop: 6 }}>
                    Top languages aggregated from cached searches.
                  </p>

                  <div style={{ height: 280, marginTop: 12 }}>
                    {topLangChart.length === 0 ? (
                      <div className="p" style={{ marginTop: 8 }}>
                        No language aggregates available.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topLangChart} layout="vertical" margin={{ top: 10, right: 10, bottom: 10, left: 40 }}>
                          <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
                          <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 12 }} axisLine={false} tickLine={false} />
                          <YAxis type="category" dataKey="name" tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 12 }} axisLine={false} tickLine={false} width={90} />
                          <Tooltip
                            contentStyle={{
                              background: "rgba(2,6,23,0.92)",
                              border: "1px solid rgba(30,41,59,0.9)",
                              borderRadius: 12,
                              color: "rgba(255,255,255,0.92)",
                            }}
                          />
                          <Bar dataKey="value" fill="rgba(30,58,138,0.85)" radius={[0, 10, 10, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bento" style={{ marginTop: 16 }}>
              <Card>
                <CardContent>
                  <h3 style={{ margin: 0 }}>Search Volume (last 14 days)</h3>
                  <p className="p" style={{ marginTop: 6 }}>
                    Derived from admin search history payload.
                  </p>

                  <div style={{ height: 260, marginTop: 12 }}>
                    {historyChart.length === 0 ? (
                      <div className="p" style={{ marginTop: 8 }}>
                        No recent searches available.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historyChart} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                          <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 12 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 12 }} axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              background: "rgba(2,6,23,0.92)",
                              border: "1px solid rgba(30,41,59,0.9)",
                              borderRadius: 12,
                              color: "rgba(255,255,255,0.92)",
                            }}
                          />
                          <Line type="monotone" dataKey="count" stroke="rgba(245,158,11,0.95)" strokeWidth={2.5} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <h3 style={{ margin: 0 }}>Search History</h3>
                  <p className="p" style={{ marginTop: 6 }}>
                    Wide table (TanStack Table).
                  </p>

                  <div style={{ marginTop: 12, overflowX: "auto" }}>
                    <table className="table" aria-label="Search history table">
                      <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                              <th key={header.id}>
                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody>
                        {table.getRowModel().rows.slice(0, 50).map((row) => (
                          <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                            ))}
                          </tr>
                        ))}
                        {table.getRowModel().rows.length === 0 ? (
                          <tr>
                            <td colSpan={columns.length} style={{ color: "rgba(255,255,255,0.65)" }}>
                              No searches recorded.
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AdminSkeleton() {
  return (
    <div aria-label="Loading admin">
      <div className="bento">
        <Card>
          <CardContent>
            <Skeleton style={{ height: 16, width: "35%", marginBottom: 10 }} />
            <Skeleton style={{ height: 44, width: "100%" }} />
            <Skeleton style={{ height: 220, width: "100%", marginTop: 12 }} />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Skeleton style={{ height: 16, width: "40%", marginBottom: 10 }} />
            <Skeleton style={{ height: 280, width: "100%" }} />
          </CardContent>
        </Card>
      </div>

      <div className="bento" style={{ marginTop: 16 }}>
        <Card>
          <CardContent>
            <Skeleton style={{ height: 16, width: "45%", marginBottom: 10 }} />
            <Skeleton style={{ height: 260, width: "100%" }} />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Skeleton style={{ height: 16, width: "30%", marginBottom: 10 }} />
            <Skeleton style={{ height: 220, width: "100%" }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

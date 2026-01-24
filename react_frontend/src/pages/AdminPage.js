import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Shield, Activity } from "lucide-react";

import { getAdminHistory, getAdminStats } from "../lib/api";

// PUBLIC_INTERFACE
export default function AdminPage() {
  /**
   * Admin portal stub.
   * “Protected” will be enforced later (auth layer). For now this scaffolds the UI and data hooks.
   */
  const stats = useQuery({ queryKey: ["admin", "stats"], queryFn: getAdminStats });
  const history = useQuery({ queryKey: ["admin", "history"], queryFn: getAdminHistory });

  const loading = stats.isFetching || history.isFetching;

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
          <a className="btn" href="/">
            Back
          </a>
        </div>

        {loading ? (
          <AdminSkeleton />
        ) : (
          <>
            <div className="bento">
              <div className="card">
                <div className="card-inner">
                  <h3 style={{ margin: 0 }}>System Health</h3>
                  <p className="p" style={{ marginTop: 6 }}>
                    Rate limit remaining: <strong>{stats.data?.rate_limit_remaining ?? "—"}</strong>
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-inner">
                  <h3 style={{ margin: 0 }}>Global Insights</h3>
                  <p className="p" style={{ marginTop: 6 }}>
                    Top languages payload: <strong>{Array.isArray(stats.data?.top_languages) ? "OK" : "—"}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: 16 }}>
              <div className="card-inner">
                <h3 style={{ margin: 0 }}>Search History</h3>
                <p className="p" style={{ marginTop: 6 }}>
                  Latest searches (table wiring will be added next with TanStack Table).
                </p>

                <pre style={{ marginTop: 12, overflowX: "auto" }}>{JSON.stringify(history.data, null, 2)}</pre>
              </div>
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
        <div className="card">
          <div className="card-inner">
            <div className="skeleton" style={{ height: 16, width: "35%", marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 44, width: "100%" }} />
          </div>
        </div>
        <div className="card">
          <div className="card-inner">
            <div className="skeleton" style={{ height: 16, width: "40%", marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 44, width: "100%" }} />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-inner">
          <div className="skeleton" style={{ height: 16, width: "30%", marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 220, width: "100%" }} />
        </div>
      </div>
    </div>
  );
}

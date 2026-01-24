import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { searchUser } from "../lib/api";
import UserInsightsView from "../components/UserInsightsView";

// PUBLIC_INTERFACE
export default function DashboardUserPage() {
  /** User insight view: /app/dashboard/:username (bento dashboard). */
  const { username } = useParams();

  const query = useQuery({
    queryKey: ["search", username],
    queryFn: () => searchUser(username),
    enabled: Boolean(username),
  });

  const isNotFound = query.error?.status === 404;

  return (
    <div className="page" style={{ paddingTop: 22 }}>
      <div className="container">
        {query.isError ? (
          <div className="card">
            <div className="card-inner">
              <div className="badge" style={{ borderColor: isNotFound ? "rgba(220,38,38,0.45)" : "var(--border)" }}>
                {isNotFound ? "404" : "Error"}
              </div>
              <h2 style={{ margin: "10px 0 6px" }}>{isNotFound ? "User not found" : "Request failed"}</h2>
              <p className="p">{query.error?.message || "Something went wrong."}</p>
            </div>
          </div>
        ) : (
          <UserInsightsView payload={query.data} isFetching={query.isFetching} />
        )}
      </div>
    </div>
  );
}

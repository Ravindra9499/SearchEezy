"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

export default function MyApplicationsPage() {
  const [
    applications,
    setApplications,
  ] = useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser =
    async () => {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      setUser(user);

      if (user?.email) {
        fetchApplications(
          user.email
        );
      } else {
        setLoading(false);
      }
    };

  const fetchApplications =
    async (
      email: string
    ) => {
      try {
        const res =
          await fetch(
            `/api/applications?email=${email}`
          );

        const data =
          await res.json();

        setApplications(
          data
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div
        style={{
          padding:
            "20px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        background:
          "#f3f2f1",

        minHeight:
          "100vh",

        padding:
          "30px 20px",
      }}
    >
      <div
        style={{
          maxWidth:
            "1000px",

          margin:
            "0 auto",
        }}
      >
        {/* Header */}

        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            marginBottom:
              "25px",

            flexWrap:
              "wrap",

            gap: "10px",
          }}
        >
          <h1
            style={{
              color:
                "#16a34a",
            }}
          >
            My Applications
          </h1>

          <a href="/">
            <button
              style={{
                background:
                  "#1c4ed8",

                color:
                  "white",

                border:
                  "none",

                padding:
                  "10px 15px",

                borderRadius:
                  "5px",

                cursor:
                  "pointer",

                fontWeight:
                  "bold",
              }}
            >
              Back to Home
            </button>
          </a>
        </div>

        {/* Not logged in */}

        {!user && (
          <div
            style={{
              background:
                "white",

              padding:
                "30px",

              borderRadius:
                "10px",

              border:
                "1px solid #ddd",
            }}
          >
            <p
              style={{
                color:
                  "gray",

                margin: 0,
              }}
            >
              Please login to
              view your
              applications.
            </p>
          </div>
        )}

        {/* Empty State */}

        {user &&
          applications.length ===
            0 && (
            <div
              style={{
                background:
                  "white",

                padding:
                  "30px",

                borderRadius:
                  "10px",

                border:
                  "1px solid #ddd",
              }}
            >
              <p
                style={{
                  color:
                    "gray",

                  margin: 0,
                }}
              >
                No applications
                found.
              </p>
            </div>
          )}

        {/* Applications */}

        {applications.map(
          (app) => (
            <div
              key={app.id}
              style={{
                background:
                  "white",

                padding:
                  "25px",

                borderRadius:
                  "12px",

                border:
                  "1px solid #ddd",

                marginBottom:
                  "20px",
              }}
            >
              <h2
                style={{
                  color:
                    "#1c4ed8",

                  marginBottom:
                    "10px",
                }}
              >
                {app.jobTitle ||
                  "Job"}
              </h2>

              <p>
                <strong>
                  Applicant:
                </strong>{" "}
                {app.name}
              </p>

              <p>
                <strong>
                  Email:
                </strong>{" "}
                {app.email}
              </p>

              <p>
                <strong>
                  Applied:
                </strong>{" "}
                {new Date(
                  app.created_at
                ).toLocaleString()}
              </p>

              {app.resumeLink && (
                <div
                  style={{
                    marginTop:
                      "15px",
                  }}
                >
                  <a
                    href={
                      app.resumeLink
                    }
                    target="_blank"
                  >
                    <button
                      style={{
                        background:
                          "#16a34a",

                        color:
                          "white",

                        border:
                          "none",

                        padding:
                          "10px 15px",

                        borderRadius:
                          "6px",

                        cursor:
                          "pointer",

                        fontWeight:
                          "bold",
                      }}
                    >
                      View Resume
                    </button>
                  </a>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
import { supabase } from "../../lib/supabase";

type Props = {
  user: any;
  role: string;
  isAdmin: boolean;
  resumeSearchEnabled: boolean;
};

export default function Navbar({
  user,
  role,
  isAdmin,
  resumeSearchEnabled,
}: Props) {
  return (
    <div
      style={{
        background:
          "white",
        padding:
          "18px 20px",
        borderBottom:
          "1px solid #e5e7eb",
        display:
          "flex",
        justifyContent:
          "space-between",
        alignItems:
          "center",
        flexWrap:
          "wrap",
        gap: "20px",
        position:
          "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            color:
              "#1c4ed8",
            fontSize:
              "30px",
            fontWeight:
              "bold",
          }}
        >
          SearchEezy
        </h1>

        <p
          style={{
            margin: 0,
            color:
              "gray",
            fontSize:
              "14px",
          }}
        >
          Modern Hiring Platform
        </p>
      </div>

      <div>
        {user ? (
          <div>
            <div
              style={{
                marginBottom:
                  "8px",
                display:
                  "flex",
                alignItems:
                  "center",
                gap: "10px",
                flexWrap:
                  "wrap",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize:
                    "14px",
                }}
              >
                {user.email}
              </p>

              {role && (
                <div
                  style={{
                    background:
                      role ===
                      "employer"
                        ? "#dbeafe"
                        : "#dcfce7",
                    color:
                      role ===
                      "employer"
                        ? "#1d4ed8"
                        : "#15803d",
                    padding:
                      "4px 10px",
                    borderRadius:
                      "999px",
                    fontSize:
                      "12px",
                    fontWeight:
                      "bold",
                    textTransform:
                      "capitalize",
                  }}
                >
                  {role}
                </div>
              )}

              {isAdmin && (
                <div
                  style={{
                    background:
                      "#fee2e2",
                    color:
                      "#dc2626",
                    padding:
                      "4px 10px",
                    borderRadius:
                      "999px",
                    fontSize:
                      "12px",
                    fontWeight:
                      "bold",
                  }}
                >
                  Admin
                </div>
              )}
            </div>

            <div
              style={{
                display:
                  "flex",
                gap: "10px",
                flexWrap:
                  "wrap",
              }}
            >
              {isAdmin && (
                <a href="/admin">
                  <button
                    style={{
                      background:
                        "#111827",
                      color:
                        "white",
                      border:
                        "none",
                      padding:
                        "10px 16px",
                      borderRadius:
                        "8px",
                      cursor:
                        "pointer",
                      fontWeight:
                        "bold",
                    }}
                  >
                    Admin Dashboard
                  </button>
                </a>
              )}

              {role ===
                "employer" && (
                <>
                  <a href="/post-job">
                    <button
                      style={{
                        background:
                          "#16a34a",
                        color:
                          "white",
                        border:
                          "none",
                        padding:
                          "10px 16px",
                        borderRadius:
                          "8px",
                        cursor:
                          "pointer",
                        fontWeight:
                          "bold",
                      }}
                    >
                      Post Job
                    </button>
                  </a>

                  <a href="/my-jobs">
                    <button
                      style={{
                        background:
                          "#1c4ed8",
                        color:
                          "white",
                        border:
                          "none",
                        padding:
                          "10px 16px",
                        borderRadius:
                          "8px",
                        cursor:
                          "pointer",
                        fontWeight:
                          "bold",
                      }}
                    >
                      My Jobs
                    </button>
                  </a>

                  {resumeSearchEnabled && (
                    <a href="/resume-search">
                      <button
                        style={{
                          background:
                            "#7c3aed",
                          color:
                            "white",
                          border:
                            "none",
                          padding:
                            "10px 16px",
                          borderRadius:
                            "8px",
                          cursor:
                            "pointer",
                          fontWeight:
                            "bold",
                        }}
                      >
                        Resume Search
                      </button>
                    </a>
                  )}
                </>
              )}

              {role ===
                "applicant" && (
                <>
                  <a href="/my-applications">
                    <button
                      style={{
                        background:
                          "#16a34a",
                        color:
                          "white",
                        border:
                          "none",
                        padding:
                          "10px 16px",
                        borderRadius:
                          "8px",
                        cursor:
                          "pointer",
                        fontWeight:
                          "bold",
                      }}
                    >
                      My Applications
                    </button>
                  </a>

                  <a href="/saved-jobs">
                    <button
                      style={{
                        background:
                          "#7c3aed",
                        color:
                          "white",
                        border:
                          "none",
                        padding:
                          "10px 16px",
                        borderRadius:
                          "8px",
                        cursor:
                          "pointer",
                        fontWeight:
                          "bold",
                      }}
                    >
                      Saved Jobs
                    </button>
                  </a>

                  <a href="/my-profile">
                    <button
                      style={{
                        background:
                          "#0f766e",
                        color:
                          "white",
                        border:
                          "none",
                        padding:
                          "10px 16px",
                        borderRadius:
                          "8px",
                        cursor:
                          "pointer",
                        fontWeight:
                          "bold",
                      }}
                    >
                      My Profile
                    </button>
                  </a>
                </>
              )}

              <button
                onClick={async () => {
                  await supabase.auth.signOut();

                  window.location.reload();
                }}
                style={{
                  background:
                    "#ef4444",
                  color:
                    "white",
                  border:
                    "none",
                  padding:
                    "10px 16px",
                  borderRadius:
                    "8px",
                  cursor:
                    "pointer",
                  fontWeight:
                    "bold",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              display:
                "flex",
              gap: "10px",
              flexWrap:
                "wrap",
            }}
          >
            <a href="/signup">
              <button
                style={{
                  background:
                    "#1c4ed8",
                  color:
                    "white",
                  border:
                    "none",
                  padding:
                    "10px 16px",
                  borderRadius:
                    "8px",
                  cursor:
                    "pointer",
                  fontWeight:
                    "bold",
                }}
              >
                Employer Signup
              </button>
            </a>

            <a href="/login">
              <button
                style={{
                  background:
                    "#2563eb",
                  color:
                    "white",
                  border:
                    "none",
                  padding:
                    "10px 16px",
                  borderRadius:
                    "8px",
                  cursor:
                    "pointer",
                  fontWeight:
                    "bold",
                }}
              >
                Employer Login
              </button>
            </a>

            <a href="/applicant-signup">
              <button
                style={{
                  background:
                    "#16a34a",
                  color:
                    "white",
                  border:
                    "none",
                  padding:
                    "10px 16px",
                  borderRadius:
                    "8px",
                  cursor:
                    "pointer",
                  fontWeight:
                    "bold",
                }}
              >
                Applicant Signup
              </button>
            </a>

            <a href="/applicant-login">
              <button
                style={{
                  background:
                    "#059669",
                  color:
                    "white",
                  border:
                    "none",
                  padding:
                    "10px 16px",
                  borderRadius:
                    "8px",
                  cursor:
                    "pointer",
                  fontWeight:
                    "bold",
                }}
              >
                Applicant Login
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
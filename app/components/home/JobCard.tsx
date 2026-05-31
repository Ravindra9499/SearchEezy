type Props = {
  job: any;
  role: string;
  savedJobs: number[];
  toggleSaveJob: (
    jobId: number,
    e: any
  ) => Promise<void>;
  getCurrencySymbol: (
    currency: string
  ) => string;
  featured?: boolean;
};

export default function JobCard({
  job,
  role,
  savedJobs,
  toggleSaveJob,
  getCurrencySymbol,
  featured = false,
}: Props) {
  return (
    <div
      onClick={() =>
        (window.location.href =
          `/jobs/${job.id}`)
      }
      style={{
        background:
          "white",
        borderRadius:
          "18px",
        padding:
          "22px",
        cursor:
          "pointer",
        boxShadow:
          featured
            ? "0 0 0 2px #f59e0b"
            : "0 4px 18px rgba(0,0,0,0.05)",
        border:
          featured
            ? "2px solid #f59e0b"
            : "1px solid #edf2f7",
        position:
          "relative",
      }}
    >
      {featured && (
        <div
          style={{
            position:
              "absolute",
            top: "16px",
            right: "16px",
            background:
              "#f59e0b",
            color:
              "white",
            padding:
              "6px 12px",
            borderRadius:
              "999px",
            fontSize:
              "12px",
            fontWeight:
              "bold",
          }}
        >
          ⭐ Featured
        </div>
      )}

      <div
        style={{
          display:
            "flex",
          alignItems:
            "flex-start",
          gap: "15px",
          flexWrap:
            "wrap",
          marginBottom:
            "15px",
        }}
      >
        {job.companyLogo && (
          <img
            src={
              job.companyLogo
            }
            alt={
              job.company
            }
            style={{
              width: "55px",
              height:
                "55px",
              objectFit:
                "contain",
              borderRadius:
                "12px",
              background:
                "white",
              border:
                "1px solid #e5e7eb",
              padding:
                "6px",
            }}
          />
        )}

        <div>
          <h2
            style={{
              margin: 0,
            }}
          >
            {job.title}
          </h2>

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap: "8px",
              flexWrap:
                "wrap",
              marginTop:
                "8px",
            }}
          >
            <a
              href={`/company/${job.company
                .toLowerCase()
                .replace(
                  /\s+/g,
                  "-"
                )}`}
              onClick={(e) =>
                e.stopPropagation()
              }
              style={{
                textDecoration:
                  "none",
                color:
                  "#1d4ed8",
                fontWeight:
                  "bold",
              }}
            >
              {job.company}
            </a>

            {job.verified && (
              <div
                style={{
                  background:
                    "#dcfce7",
                  color:
                    "#15803d",
                  padding:
                    "4px 10px",
                  borderRadius:
                    "999px",
                  fontSize:
                    "11px",
                  fontWeight:
                    "bold",
                }}
              >
                ✔ Verified
              </div>
            )}
          </div>
        </div>
      </div>

      <p>
        📍 {job.location}
      </p>

      {job.jobType && (
        <p>
          💼 {job.jobType}
        </p>
      )}

      {job.category && (
        <div
          style={{
            display:
              "inline-block",
            background:
              "#eff6ff",
            color:
              "#1d4ed8",
            padding:
              "6px 12px",
            borderRadius:
              "20px",
            fontSize:
              "13px",
            fontWeight:
              "bold",
            marginTop:
              "10px",
          }}
        >
          {job.category}
        </div>
      )}

      {role ===
        "applicant" && (
        <button
          onClick={(e) =>
            toggleSaveJob(
              job.id,
              e
            )
          }
          style={{
            marginTop:
              "18px",
            background:
              savedJobs.includes(
                job.id
              )
                ? "#fee2e2"
                : "#eff6ff",
            color:
              savedJobs.includes(
                job.id
              )
                ? "#dc2626"
                : "#1d4ed8",
            border:
              "none",
            padding:
              "10px 14px",
            borderRadius:
              "10px",
            cursor:
              "pointer",
            fontWeight:
              "bold",
          }}
        >
          {savedJobs.includes(
            job.id
          )
            ? "❤️ Saved"
            : "🤍 Save Job"}
        </button>
      )}

      {job.salaryMin &&
        job.salaryMax && (
          <p
            style={{
              marginTop:
                "20px",
              color:
                "#16a34a",
              fontWeight:
                "bold",
              fontSize:
                "18px",
            }}
          >
            💰{" "}
            {getCurrencySymbol(
              job.currency
            )}
            {Number(
              job.salaryMin
            ).toLocaleString(
              "en-US"
            )}
            {" - "}
            {getCurrencySymbol(
              job.currency
            )}
            {Number(
              job.salaryMax
            ).toLocaleString(
              "en-US"
            )}
          </p>
        )}
    </div>
  );
}
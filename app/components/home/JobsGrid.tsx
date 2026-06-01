import JobCard from "./JobCard";
import FeaturedJobs from "./FeaturedJobs";

type Props = {
  loading: boolean;
  filteredJobs: any[];
  featuredJobs: any[];
  regularJobs: any[];
  role: string;
  savedJobs: number[];
  toggleSaveJob: (
    jobId: number,
    e: any
  ) => Promise<void>;
  getCurrencySymbol: (
    currency: string
  ) => string;
};

export default function JobsGrid({
  loading,
  filteredJobs,
  featuredJobs,
  regularJobs,
  role,
  savedJobs,
  toggleSaveJob,
  getCurrencySymbol,
}: Props) {
  return (
    <>
      {loading ? (
        <div
          style={{
            textAlign:
              "center",
            padding:
              "60px",
          }}
        >
          Loading jobs...
        </div>
      ) : filteredJobs.length ===
        0 ? (
        <div
          style={{
            background:
              "white",
            padding:
              "50px",
            borderRadius:
              "20px",
            textAlign:
              "center",
          }}
        >
          <h2>No jobs found</h2>

          <p>
            Try different search
            filters.
          </p>
        </div>
      ) : (
        <>
          <FeaturedJobs
            featuredJobs={
              featuredJobs
            }
            role={role}
            savedJobs={
              savedJobs
            }
            toggleSaveJob={
              toggleSaveJob
            }
            getCurrencySymbol={
              getCurrencySymbol
            }
          />

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "22px",
            }}
          >
            {regularJobs.map(
              (job) => (
                <JobCard
                  key={
                    job.id
                  }
                  job={job}
                  role={role}
                  savedJobs={
                    savedJobs
                  }
                  toggleSaveJob={
                    toggleSaveJob
                  }
                  getCurrencySymbol={
                    getCurrencySymbol
                  }
                />
              )
            )}
          </div>
        </>
      )}
    </>
  );
}
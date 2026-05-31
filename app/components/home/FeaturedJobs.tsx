import JobCard from "./JobCard";

type Props = {
  featuredJobs: any[];
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

export default function FeaturedJobs({
  featuredJobs,
  role,
  savedJobs,
  toggleSaveJob,
  getCurrencySymbol,
}: Props) {
  if (
    featuredJobs.length ===
    0
  ) {
    return null;
  }

  return (
    <div
      style={{
        marginBottom:
          "40px",
      }}
    >
      <h2
        style={{
          color:
            "#f59e0b",
          marginBottom:
            "20px",
        }}
      >
        ⭐ Featured Jobs
      </h2>

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "22px",
        }}
      >
        {featuredJobs.map(
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
              featured
            />
          )
        )}
      </div>
    </div>
  );
}
type Props = {
  searchTitle: string;
  setSearchTitle: (
    value: string
  ) => void;
  searchLocation: string;
  setSearchLocation: (
    value: string
  ) => void;
  filteredJobs: any[];
};

export default function SearchFilters({
  searchTitle,
  setSearchTitle,
  searchLocation,
  setSearchLocation,
  filteredJobs,
}: Props) {
  return (
    <div
      style={{
        maxWidth:
          "1200px",
        margin:
          "30px auto",
        padding:
          "0 20px",
      }}
    >
      <div
        style={{
          background:
            "white",
          padding:
            "25px",
          borderRadius:
            "20px",
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "15px",
            marginBottom:
              "20px",
          }}
        >
          <input
            placeholder="Search jobs, skills, companies..."
            value={searchTitle}
            onChange={(e) =>
              setSearchTitle(
                e.target.value
              )
            }
            style={{
              width:
                "100%",
              padding:
                "15px",
              borderRadius:
                "10px",
              border:
                "1px solid #ddd",
              fontSize:
                "16px",
            }}
          />

          <input
            placeholder="Search by location"
            value={
              searchLocation
            }
            onChange={(e) =>
              setSearchLocation(
                e.target.value
              )
            }
            style={{
              width:
                "100%",
              padding:
                "15px",
              borderRadius:
                "10px",
              border:
                "1px solid #ddd",
              fontSize:
                "16px",
            }}
          />
        </div>

        <div
          style={{
            marginBottom:
              "18px",
            color:
              "#6b7280",
            fontWeight:
              "bold",
          }}
        >
          {filteredJobs.length}
          {" "}
          jobs found
        </div>
      </div>
    </div>
  );
}
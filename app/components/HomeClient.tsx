"use client";

import JobCard from "./home/JobCard";
import Navbar from "./home/Navbar";
import SearchFilters from "./home/SearchFilters";
import FeaturedJobs from "./home/FeaturedJobs";
import JobsGrid from "./home/JobsGrid";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

export default function HomeClient({
  jobs,
}: {
  jobs: any[];
}) {
  const [user, setUser] =
    useState<any>(null);

  const [role, setRole] =
    useState("");

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [
    resumeSearchEnabled,
    setResumeSearchEnabled,
  ] = useState(false);

  const [displayJobs, setDisplayJobs] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [savedJobs, setSavedJobs] =
    useState<number[]>([]);

  const [
    searchTitle,
    setSearchTitle,
  ] = useState("");

  const [
    searchLocation,
    setSearchLocation,
  ] = useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  useEffect(() => {
    const getUser =
      async () => {
        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        setUser(user);

        if (user?.id) {
          const res =
            await fetch(
              `/api/profile?email=${user.email}`
            );

          const profile =
            await res.json();

          if (
            profile?.role
          ) {
            setRole(
              profile.role
            );
          }

          setIsAdmin(
            profile.isAdmin ===
              true
          );

          setResumeSearchEnabled(
            profile.resumeSearchEnabled ===
              true
          );

          if (
            profile.role ===
            "applicant"
          ) {
            const {
              data: savedData,
            } =
              await supabase
                .from(
                  "saved_jobs"
                )
                .select(
                  "jobId"
                )
                .eq(
                  "userEmail",
                  user.email
                );

            if (
              savedData
            ) {
              setSavedJobs(
                savedData.map(
                  (
                    item
                  ) =>
                    Number(
                      item.jobId
                    )
                )
              );
            }
          }

          if (
            profile.role ===
            "employer"
          ) {
            const jobsRes =
              await fetch(
                `/api/jobs?userEmail=${user.email}`,
                {
                  cache:
                    "no-store",
                }
              );

            const employerJobs =
              await jobsRes.json();

            setDisplayJobs(
              employerJobs
            );
          } else {
            setDisplayJobs(jobs);
          }
        } else {
          setDisplayJobs(jobs);
        }

        setLoading(false);
      };

    getUser();
  }, [jobs]);

  const toggleSaveJob =
    async (
      jobId: number,
      e: any
    ) => {
      e.stopPropagation();

      if (!user) {
        alert(
          "Please login as applicant"
        );

        return;
      }

      const alreadySaved =
        savedJobs.includes(
          jobId
        );

      if (
        alreadySaved
      ) {
        await supabase
          .from(
            "saved_jobs"
          )
          .delete()
          .eq(
            "userEmail",
            user.email
          )
          .eq(
            "jobId",
            String(jobId)
          );

        setSavedJobs(
          savedJobs.filter(
            (id) =>
              id !==
              jobId
          )
        );
      } else {
        await supabase
          .from(
            "saved_jobs"
          )
          .insert([
            {
              userEmail:
                user.email,
              jobId:
                String(jobId),
            },
          ]);

        setSavedJobs([
          ...savedJobs,
          jobId,
        ]);
      }
    };

  const getCurrencySymbol =
    (
      currency: string
    ) => {
      switch (
        currency
      ) {
        case "USD":
          return "$";

        case "INR":
          return "₹";

        case "EUR":
          return "€";

        case "GBP":
          return "£";

        default:
          return "$";
      }
    };

  const categories = [
    "All",

    ...Array.from(
      new Set(
        displayJobs
          .map(
            (job) =>
              job.category
          )
          .filter(Boolean)
      )
    ),
  ];

  const filteredJobs =
    displayJobs.filter(
      (job) => {
        const searchValue =
          searchTitle.toLowerCase();

        const matchesTitle =
          job.title
            ?.toLowerCase()
            .includes(
              searchValue
            ) ||
          job.company
            ?.toLowerCase()
            .includes(
              searchValue
            );

        const matchesLocation =
          job.location
            ?.toLowerCase()
            .includes(
              searchLocation.toLowerCase()
            );

        const matchesCategory =
          selectedCategory ===
            "All" ||
          job.category ===
            selectedCategory;

        return (
          matchesTitle &&
          matchesLocation &&
          matchesCategory
        );
      }
    );

  const featuredJobs =
    filteredJobs.filter(
      (job) =>
        job.featured
    );

  const regularJobs =
    filteredJobs.filter(
      (job) =>
        !job.featured
    );

  return (
    <div
      style={{
        background:
          "#f5f7fb",
        minHeight:
          "100vh",
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      <Navbar
        user={user}
        role={role}
        isAdmin={isAdmin}
        resumeSearchEnabled={
          resumeSearchEnabled
        }
      />

      <SearchFilters
        searchTitle={
          searchTitle
        }
        setSearchTitle={
          setSearchTitle
        }
        searchLocation={
          searchLocation
        }
        setSearchLocation={
          setSearchLocation
        }
        filteredJobs={
          filteredJobs
        }
      />

      <div
        style={{
          maxWidth:
            "1200px",
          margin:
            "0 auto",
          padding:
            "0 20px 30px",
        }}
      >
        <div
          style={{
            display:
              "flex",
            gap: "10px",
            flexWrap:
              "wrap",
          }}
        >
          {categories.map(
            (category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }
                style={{
                  background:
                    selectedCategory ===
                    category
                      ? "#1c4ed8"
                      : "white",
                  color:
                    selectedCategory ===
                    category
                      ? "white"
                      : "#1c4ed8",
                  border:
                    "1px solid #1c4ed8",
                  padding:
                    "10px 16px",
                  borderRadius:
                    "999px",
                  cursor:
                    "pointer",
                  fontWeight:
                    "bold",
                }}
              >
                {category}
              </button>
            )
          )}
        </div>
      </div>

      {/* JOBS */}

      <div
        style={{
          maxWidth:
            "1200px",
          margin:
            "0 auto",
          padding:
            "0 20px 50px",
        }}
      >
<JobsGrid
  loading={loading}
  filteredJobs={
    filteredJobs
  }
  featuredJobs={
    featuredJobs
  }
  regularJobs={
    regularJobs
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

      </div>
    </div>
  );
}

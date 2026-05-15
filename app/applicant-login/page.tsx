"use client";

import { useState } from "react";

import { supabase } from "../lib/supabase";

import { useRouter } from "next/navigation";

export default function ApplicantLoginPage() {
  const router =
    useRouter();

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const handleLogin =
    async () => {
      const {
        data,
        error,
      } =
        await supabase.auth.signInWithPassword(
          {
            email,

            password,
          }
        );

      if (error) {
        alert(
          error.message
        );

        return;
      }

      const userId =
        data.user?.id;

      // Fetch profile

      if (userId) {
        const res =
          await fetch(
            `/api/profile?userId=${userId}`
          );

        const profile =
          await res.json();

        console.log(
          "USER ROLE:",
          profile.role
        );

        // Safety check

        if (
          profile.role !==
          "applicant"
        ) {
          alert(
            "This is not an applicant account."
          );

          return;
        }
      }

      alert(
        "Applicant login successful"
      );

      router.replace("/");
    };

  return (
    <div
      style={{
        maxWidth:
          "400px",

        margin:
          "100px auto",

        padding:
          "20px",

        border:
          "1px solid #ddd",

        borderRadius:
          "10px",

        background:
          "white",
      }}
    >
      <h1
        style={{
          color:
            "#16a34a",

          marginBottom:
            "20px",
        }}
      >
        Applicant Login
      </h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(
            e.target.value
          )
        }
        style={{
          width:
            "100%",

          padding:
            "10px",

          marginBottom:
            "10px",
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
        style={{
          width:
            "100%",

          padding:
            "10px",

          marginBottom:
            "10px",
        }}
      />

      <button
        onClick={
          handleLogin
        }
        style={{
          width:
            "100%",

          padding:
            "10px",

          background:
            "#16a34a",

          color:
            "white",

          border:
            "none",

          borderRadius:
            "5px",

          cursor:
            "pointer",

          fontWeight:
            "bold",
        }}
      >
        Login
      </button>
    </div>
  );
}
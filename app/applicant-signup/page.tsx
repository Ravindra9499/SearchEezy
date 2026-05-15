"use client";

import { useState } from "react";

import { supabase } from "../lib/supabase";

export default function ApplicantSignupPage() {
  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const handleSignup =
    async () => {
      if (
        !email ||
        !password
      ) {
        alert(
          "Please fill all fields"
        );

        return;
      }

      // Create auth user

      const {
        data,
        error,
      } =
        await supabase.auth.signUp(
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

      // Create applicant profile

      const userId =
        data.user?.id;

      if (userId) {
        const {
          error:
            profileError,
        } =
          await supabase
            .from(
              "profiles"
            )
            .insert([
              {
                id: userId,

                email,

                role:
                  "applicant",
              },
            ]);

        if (
          profileError
        ) {
          console.error(
            "PROFILE ERROR:",
            profileError
          );
        } else {
          console.log(
            "APPLICANT PROFILE CREATED"
          );
        }
      }

      alert(
        "Applicant signup successful!"
      );
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
        Applicant Signup
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
          handleSignup
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
        Sign Up
      </button>
    </div>
  );
}
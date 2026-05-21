"use client";

import { useState } from "react";

import { supabase } from "../lib/supabase";

export default function SignupPage() {
  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  // CHANGE TO TRUE
  // BEFORE PRODUCTION LAUNCH

  const COMPANY_EMAIL_ONLY =
    false;

  const blockedDomains = [
    "gmail.com",

    "yahoo.com",

    "outlook.com",

    "hotmail.com",

    "aol.com",

    "icloud.com",

    "protonmail.com",
  ];

  const handleSignup =
    async () => {
      if (
        !email ||
        !password
      ) {
        alert(
          "Please fill all fields."
        );

        return;
      }

      const domain =
        email
          .split("@")[1]
          ?.toLowerCase();

      if (
        COMPANY_EMAIL_ONLY &&
        blockedDomains.includes(
          domain
        )
      ) {
        alert(
          "Please use your official company email address."
        );

        return;
      }

      try {
        setLoading(true);

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

          setLoading(false);

          return;
        }

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
              .upsert([
                {
                  id: userId,

                  email,

                  role:
                    "employer",
                },
              ]);

          if (
            profileError
          ) {
            console.error(
              "PROFILE ERROR:",
              profileError
            );
          }
        }

        alert(
          "Signup successful! Please check your email inbox."
        );

        setEmail("");

        setPassword("");
      } catch (err) {
        console.error(err);

        alert(
          "Something went wrong during signup."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div
      style={{
        maxWidth:
          "420px",

        margin:
          "100px auto",

        padding:
          "30px",

        border:
          "1px solid #e5e7eb",

        borderRadius:
          "16px",

        background:
          "white",

        boxShadow:
          "0 4px 18px rgba(0,0,0,0.05)",
      }}
    >
      <h1
        style={{
          color:
            "#1c4ed8",

          marginBottom:
            "10px",

          fontSize:
            "32px",
        }}
      >
        Employer Signup
      </h1>

      <p
        style={{
          color:
            "#6b7280",

          marginBottom:
            "24px",
        }}
      >
        Create your employer
        account on SearchEezy.
      </p>

      <input
        type="email"
        placeholder="Company Email"
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
            "14px",

          marginBottom:
            "14px",

          border:
            "1px solid #d1d5db",

          borderRadius:
            "10px",

          fontSize:
            "15px",
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
            "14px",

          marginBottom:
            "18px",

          border:
            "1px solid #d1d5db",

          borderRadius:
            "10px",

          fontSize:
            "15px",
        }}
      />

      <button
        onClick={
          handleSignup
        }
        disabled={loading}
        style={{
          width:
            "100%",

          padding:
            "14px",

          background:
            loading
              ? "#93c5fd"
              : "#1c4ed8",

          color:
            "white",

          border:
            "none",

          borderRadius:
            "10px",

          cursor:
            loading
              ? "not-allowed"
              : "pointer",

          fontWeight:
            "bold",

          fontSize:
            "15px",
        }}
      >
        {loading
          ? "Creating Account..."
          : "Sign Up"}
      </button>

      <p
        style={{
          marginTop:
            "18px",

          fontSize:
            "14px",

          color:
            "#6b7280",

          lineHeight:
            "22px",
        }}
      >
        Employers should
        eventually use official
        company email
        addresses for verified
        hiring access.
      </p>
    </div>
  );
}
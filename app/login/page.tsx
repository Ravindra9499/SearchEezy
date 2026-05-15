"use client";

import { useState } from "react";

import { supabase } from "../lib/supabase";

import { useRouter } from "next/navigation";

export default function LoginPage() {
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

      // Fetch profile from API

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
      }

      alert(
        "Login successful"
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
      }}
    >
      <h1>
        Employer Login
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
            "#1c4ed8",

          color:
            "white",

          border:
            "none",

          borderRadius:
            "5px",

          cursor:
            "pointer",
        }}
      >
        Login
      </button>
    </div>
  );
}
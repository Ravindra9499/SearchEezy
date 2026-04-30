"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // change this to true before production launch
  const COMPANY_EMAIL_ONLY = false;

  const blockedDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "aol.com",
    "icloud.com",
    "protonmail.com",
  ];

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    const domain = email.split("@")[1]?.toLowerCase();

    if (
      COMPANY_EMAIL_ONLY &&
      blockedDomains.includes(domain)
    ) {
      alert(
        "Please use your official company email address."
      );
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful! Check your email.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "100px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        background: "white",
      }}
    >
      <h1
        style={{
          color: "#1c4ed8",
          marginBottom: "20px",
        }}
      >
        Employer Signup
      </h1>

      <input
        type="email"
        placeholder="Company Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <button
        onClick={handleSignup}
        style={{
          width: "100%",
          padding: "10px",
          background: "#1c4ed8",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Sign Up
      </button>

      <p
        style={{
          marginTop: "15px",
          fontSize: "14px",
          color: "gray",
        }}
      >
        Employers should use official company email addresses.
      </p>
    </div>
  );
}
"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
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
      }}
    >
      <h1>Employer Signup</h1>

      <input
        type="email"
        placeholder="Email"
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
        }}
      >
        Sign Up
      </button>
    </div>
  );
}
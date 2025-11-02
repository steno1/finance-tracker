"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
      } else {
        toast.success("Reset link sent! Check your email");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center ">
      <form
        onSubmit={handleForgotPassword}
        className="bg-white shadow-md p-8 rounded-md flex flex-col gap-4 w-90"
      >
        <h1 className="text-xl font-semibold text-center">Forgot Password</h1>
        <p className="text-sm text-gray-600 text-center">
          Enter your registered email to reset your password
        </p>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <a
          href="/login"
          className="text-sm text-center text-blue-600 hover:underline"
        >
          Back to Login
        </a>
      </form>
    </div>
  );
}

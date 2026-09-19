"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi, ApiError } from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    organization_name: "",
    project_name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      await fetchApi("/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      // On success, the API sets an HTTP-only cookie, so we can just route to projects
      router.push("/projects");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col items-center justify-center p-4 selection:bg-primary selection:text-background">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm flex flex-col gap-12"
      >
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-metadata font-mono tracking-widest uppercase hover:opacity-70 transition-opacity w-max">
            AETHER
          </Link>
          <h1 className="text-section-title font-medium tracking-tight">Create Account</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="text-metadata font-mono text-red-500 border border-red-500/20 bg-red-500/5 p-3 rounded-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-metadata font-mono text-secondary uppercase tracking-widest" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="bg-transparent border-b border-surface-2 py-2 focus:outline-none focus:border-primary transition-colors text-body"
              required
              disabled={loading}
              autoComplete="name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-metadata font-mono text-secondary uppercase tracking-widest" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-transparent border-b border-surface-2 py-2 focus:outline-none focus:border-primary transition-colors text-body"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-metadata font-mono text-secondary uppercase tracking-widest" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-transparent border-b border-surface-2 py-2 focus:outline-none focus:border-primary transition-colors text-body"
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-metadata font-mono text-secondary uppercase tracking-widest" htmlFor="confirm_password">
              Confirm Password
            </label>
            <input
              id="confirm_password"
              type="password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="bg-transparent border-b border-surface-2 py-2 focus:outline-none focus:border-primary transition-colors text-body"
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-metadata font-mono text-secondary uppercase tracking-widest" htmlFor="organization_name">
              Workspace (Organization)
            </label>
            <input
              id="organization_name"
              type="text"
              value={formData.organization_name}
              onChange={handleChange}
              className="bg-transparent border-b border-surface-2 py-2 focus:outline-none focus:border-primary transition-colors text-body"
              required
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-metadata font-mono text-secondary uppercase tracking-widest" htmlFor="project_name">
              Initial Project
            </label>
            <input
              id="project_name"
              type="text"
              value={formData.project_name}
              onChange={handleChange}
              className="bg-transparent border-b border-surface-2 py-2 focus:outline-none focus:border-primary transition-colors text-body"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-primary text-background py-3 font-mono text-metadata tracking-widest uppercase hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="flex flex-col gap-8 text-center mt-4 mb-12">
          <div className="text-metadata font-mono text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:opacity-70 transition-opacity underline underline-offset-4 decoration-surface-2 hover:decoration-primary">
              AUTHENTICATE
            </Link>
          </div>
          
          <div className="text-metadata font-mono text-tertiary">
            ENGINEERING INSTRUMENT / v1.0.0
          </div>
        </div>
      </motion.div>
    </div>
  );
}

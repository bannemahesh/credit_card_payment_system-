import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post("/users/register/", form);
      navigate("/login");
    } catch (err) {
      const data = err.response?.data;

      if (data) {
        const firstError = Object.values(data).flat()[0];
        setError(firstError || "Unable to create account.");
      } else {
        setError("Unable to create account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Brand panel */}
        <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-slate-950 p-12 text-white">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl font-bold backdrop-blur">
                  P
                </div>

                <div>
                  <h1 className="text-xl font-bold">
                    PaySecure
                  </h1>

                  <p className="text-xs text-blue-200">
                    Payment Management
                  </p>
                </div>
              </div>

              <div className="mt-32 max-w-lg">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
                  Get started
                </p>

                <h2 className="mt-5 text-5xl font-bold leading-tight">
                  One place for your
                  <br />
                  payment activity.
                </h2>

                <p className="mt-6 max-w-md text-lg leading-8 text-blue-100">
                  Add test cards, manage balances and track simulated
                  payments from one secure dashboard.
                </p>

                <div className="mt-10 space-y-4">
                  {[
                    "Secure JWT authentication",
                    "Masked card information",
                    "Payment transaction history",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-blue-100"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs">
                        ✓
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-sm text-blue-200">
              <p>© 2026 PaySecure</p>
              <p className="mt-1">
                Simulation environment — no real payments processed.
              </p>
            </div>
          </div>
        </div>

        {/* Registration panel */}
        <div className="flex items-center justify-center bg-slate-50 px-6 py-12">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                  P
                </div>

                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    PaySecure
                  </h1>

                  <p className="text-xs text-slate-500">
                    Payment Management
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-blue-600">
                Create your account
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Get started with PaySecure
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Create an account to manage your simulated payments.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                  autoComplete="username"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Email address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <span className="text-xs text-slate-400">
                    Minimum 8 characters
                  </span>
                </div>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6 text-center">
              <p className="text-xs leading-5 text-slate-400">
                Your password is securely hashed by Django.
                No real card or banking information is required.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
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
      const response = await api.post("/users/login/", form);

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Invalid username or password."
      );
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
                  Secure payment management
                </p>

                <h2 className="mt-5 text-5xl font-bold leading-tight">
                  Manage your cards.
                  <br />
                  Make payments.
                  <br />
                  Stay in control.
                </h2>

                <p className="mt-6 max-w-md text-lg leading-8 text-blue-100">
                  A secure simulated payment platform for managing
                  cards, balances and transaction history.
                </p>
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

        {/* Login panel */}
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
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Sign in to your account
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Access your cards, balance and payment history.
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
                  placeholder="Enter your username"
                  required
                  autoComplete="username"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <span className="text-xs text-slate-400">
                    Protected
                  </span>
                </div>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Create an account
              </Link>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6 text-center">
              <p className="text-xs leading-5 text-slate-400">
                This application uses simulated payments for testing
                purposes. No real card or banking transactions are
                performed.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
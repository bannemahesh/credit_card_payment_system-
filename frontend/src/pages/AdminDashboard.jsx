import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    dashboard: (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    users: (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    card: (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
    payment: (
      <svg {...common}>
        <path d="M12 3v18" />
        <path d="M17 7c0-2-2-3-5-3s-5 1-5 3 2 3 5 3 5 1 5 3-2 3-5 3-5-1-5-3" />
      </svg>
    ),
    check: (
      <svg {...common}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    ),
    close: (
      <svg {...common}>
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    ),
    clock: (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
    money: (
      <svg {...common}>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M7 9h.01M17 15h.01" />
      </svg>
    ),
    logout: (
      <svg {...common}>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 19V5a2 2 0 0 0-2-2h-5" />
      </svg>
    ),
  };

  return icons[name] || null;
}

function AdminDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get("/users/admin-dashboard/");
        setData(response.data);
      } catch (err) {
        setError(
          err.response?.status === 403
            ? "Access denied. Admin access is required."
            : "Unable to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center border-b border-slate-100 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-bold text-white">
            P
          </div>

          <div className="ml-3">
            <p className="font-bold text-slate-900">
              PaySecure
            </p>
            <p className="text-xs text-slate-400">
              Administration
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Admin
          </p>

          <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-900 px-3 py-3 text-sm font-semibold text-white">
            <Icon name="dashboard" />
            Overview
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <Icon name="users" />
            User Dashboard
          </button>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <Icon name="logout" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">

        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex h-20 items-center justify-between px-6 lg:px-10">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Administration
              </p>

              <h1 className="text-xl font-bold text-slate-900">
                System Overview
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-800">
                  Administrator
                </p>
                <p className="text-xs text-slate-400">
                  System access
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-bold text-white">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">

          <div>
            <p className="text-sm font-semibold text-blue-600">
              Platform analytics
            </p>

            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Payment system overview
            </h2>

            <p className="mt-2 text-slate-500">
              Monitor users, cards and simulated payment activity.
            </p>
          </div>

          {error && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-2xl bg-slate-200"
                />
              ))}
            </div>
          ) : data ? (
            <>
              {/* Primary stats */}
              <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-300">
                      Total Users
                    </p>

                    <div className="rounded-lg bg-white/10 p-2">
                      <Icon name="users" size={19} />
                    </div>
                  </div>

                  <p className="mt-5 text-3xl font-bold">
                    {data.total_users}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Registered accounts
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                      Saved Cards
                    </p>

                    <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                      <Icon name="card" size={19} />
                    </div>
                  </div>

                  <p className="mt-5 text-3xl font-bold text-slate-900">
                    {data.total_cards}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Payment cards
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                      Transactions
                    </p>

                    <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                      <Icon name="payment" size={19} />
                    </div>
                  </div>

                  <p className="mt-5 text-3xl font-bold text-slate-900">
                    {data.total_transactions}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Total payment attempts
                  </p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 p-6 text-white shadow-lg shadow-blue-900/10">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-blue-100">
                      Payment Value
                    </p>

                    <div className="rounded-lg bg-white/10 p-2">
                      <Icon name="money" size={19} />
                    </div>
                  </div>

                  <p className="mt-5 text-3xl font-bold">
                    ₹{formatAmount(data.total_amount)}
                  </p>

                  <p className="mt-2 text-xs text-blue-200">
                    Total transaction amount
                  </p>
                </div>
              </section>

              {/* Payment status */}
              <section className="mt-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Payment Status
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Current transaction outcome distribution.
                  </p>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-3">

                  <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-white">
                        <Icon name="check" />
                      </div>

                      <span className="text-xs font-bold uppercase tracking-wide text-green-600">
                        Success
                      </span>
                    </div>

                    <p className="mt-5 text-3xl font-bold text-green-900">
                      {data.successful_payments}
                    </p>

                    <p className="mt-1 text-sm text-green-700">
                      Successful payments
                    </p>
                  </div>

                  <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white">
                        <Icon name="close" />
                      </div>

                      <span className="text-xs font-bold uppercase tracking-wide text-red-600">
                        Failed
                      </span>
                    </div>

                    <p className="mt-5 text-3xl font-bold text-red-900">
                      {data.failed_payments}
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      Failed payments
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white">
                        <Icon name="clock" />
                      </div>

                      <span className="text-xs font-bold uppercase tracking-wide text-amber-600">
                        Pending
                      </span>
                    </div>

                    <p className="mt-5 text-3xl font-bold text-amber-900">
                      {data.pending_payments}
                    </p>

                    <p className="mt-1 text-sm text-amber-700">
                      Pending payments
                    </p>
                  </div>

                </div>
              </section>

              {/* Overview panel */}
              <section className="mt-8 grid gap-6 lg:grid-cols-2">

                <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                  <h3 className="font-bold text-slate-900">
                    Platform Health
                  </h3>

                  <div className="mt-6 space-y-5">

                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">
                          Successful payments
                        </span>

                        <span className="font-semibold text-slate-900">
                          {data.total_transactions
                            ? Math.round(
                                (data.successful_payments /
                                  data.total_transactions) *
                                  100
                              )
                            : 0}
                          %
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-green-500"
                          style={{
                            width: `${
                              data.total_transactions
                                ? Math.min(
                                    100,
                                    (data.successful_payments /
                                      data.total_transactions) *
                                      100
                                  )
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">
                          Failed payments
                        </span>

                        <span className="font-semibold text-slate-900">
                          {data.total_transactions
                            ? Math.round(
                                (data.failed_payments /
                                  data.total_transactions) *
                                  100
                              )
                            : 0}
                          %
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-red-500"
                          style={{
                            width: `${
                              data.total_transactions
                                ? Math.min(
                                    100,
                                    (data.failed_payments /
                                      data.total_transactions) *
                                      100
                                  )
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                  </div>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-7">
                  <h3 className="font-bold text-blue-900">
                    Administration Notice
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-blue-700">
                    This dashboard provides administrative visibility
                    into the simulated credit card payment system.
                    Payment activity shown here is generated by the
                    application and does not represent real financial
                    transactions.
                  </p>

                  <button
                    onClick={() => navigate("/dashboard")}
                    className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Open User Dashboard
                  </button>
                </div>

              </section>
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
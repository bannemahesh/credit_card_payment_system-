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
    history: (
      <svg {...common}>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
    logout: (
      <svg {...common}>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 19V5a2 2 0 0 0-2-2h-5" />
      </svg>
    ),
    plus: (
      <svg {...common}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    ),
    arrow: (
      <svg {...common}>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    ),
    wallet: (
      <svg {...common}>
        <path d="M4 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
        <path d="M4 8h15" />
        <path d="M16 13h4" />
      </svg>
    ),
  };

  return icons[name] || null;
}

function Dashboard() {
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [balanceAmount, setBalanceAmount] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setError("");

      const [cardsResponse, transactionsResponse] =
        await Promise.all([
          api.get("/cards/"),
          api.get("/transactions/"),
        ]);

      setCards(cardsResponse.data);
      setTransactions(transactionsResponse.data.slice(0, 5));
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  const addBalance = async (e) => {
    e.preventDefault();

    if (!selectedCard || !balanceAmount) return;

    setMessage("");
    setError("");

    try {
      await api.post(
        `/cards/${selectedCard}/add-balance/`,
        {
          amount: Number(balanceAmount),
        }
      );

      setMessage(
        `₹${Number(balanceAmount).toFixed(2)} added successfully.`
      );

      setBalanceAmount("");
      setSelectedCard(null);

      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Unable to add balance."
      );
    }
  };

  const totalBalance = cards.reduce(
    (total, card) =>
      total + Number(card.available_balance || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center border-b border-slate-100 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
            P
          </div>

          <div className="ml-3">
            <p className="font-bold text-slate-900">
              PaySecure
            </p>
            <p className="text-xs text-slate-400">
              Payment Management
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <button
            className="mt-3 flex w-full items-center gap-3 rounded-xl bg-blue-50 px-3 py-3 text-sm font-semibold text-blue-700"
          >
            <Icon name="dashboard" />
            Dashboard
          </button>

          <button
            onClick={() => navigate("/cards/add")}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <Icon name="card" />
            Add Card
          </button>

          <button
            onClick={() => navigate("/payment")}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <Icon name="payment" />
            Make Payment
          </button>

          <button
            onClick={() => navigate("/transactions")}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <Icon name="history" />
            Transactions
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

        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex h-20 items-center justify-between px-6 lg:px-10">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Overview
              </p>
              <h1 className="text-xl font-bold text-slate-900">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-800">
                  Payment Account
                </p>
                <p className="text-xs text-slate-400">
                  Simulation mode
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                U
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">

          {/* Mobile navigation */}
          <div className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
            <button
              onClick={() => navigate("/dashboard")}
              className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/cards/add")}
              className="whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm"
            >
              Add Card
            </button>

            <button
              onClick={() => navigate("/payment")}
              className="whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm"
            >
              Payment
            </button>

            <button
              onClick={() => navigate("/transactions")}
              className="whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm"
            >
              History
            </button>
          </div>

          {/* Welcome */}
          <section>
            <p className="text-sm font-semibold text-blue-600">
              Welcome back
            </p>

            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Your financial overview
            </h2>

            <p className="mt-2 text-slate-500">
              Manage your cards and simulated payment activity.
            </p>
          </section>

          {/* Alerts */}
          {message && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {/* Stats */}
          <section className="mt-8 grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 p-6 text-white shadow-lg shadow-blue-900/10">
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-100">
                  Total Available
                </p>

                <div className="rounded-lg bg-white/10 p-2">
                  <Icon name="wallet" />
                </div>
              </div>

              <p className="mt-5 text-3xl font-bold">
                ₹{totalBalance.toFixed(2)}
              </p>

              <p className="mt-2 text-xs text-blue-200">
                Across {cards.length} saved card
                {cards.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Saved Cards
              </p>

              <p className="mt-4 text-3xl font-bold text-slate-900">
                {cards.length}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                Active payment cards
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Recent Activity
              </p>

              <p className="mt-4 text-3xl font-bold text-slate-900">
                {transactions.length}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                Latest transactions
              </p>
            </div>
          </section>

          {/* Cards */}
          <section className="mt-10">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Your Cards
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your saved payment cards.
                </p>
              </div>

              <button
                onClick={() => navigate("/cards/add")}
                className="hidden items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 sm:flex"
              >
                <Icon name="plus" size={17} />
                Add Card
              </button>
            </div>

            {loading ? (
              <div className="mt-5 h-72 animate-pulse rounded-2xl bg-slate-200" />
            ) : cards.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Icon name="card" size={26} />
                </div>

                <h4 className="mt-4 font-bold text-slate-900">
                  No payment cards
                </h4>

                <p className="mt-2 text-sm text-slate-500">
                  Add a test card to start using the payment system.
                </p>

                <button
                  onClick={() => navigate("/cards/add")}
                  className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Add your first card
                </button>
              </div>
            ) : (
              <div className="mt-5 grid gap-6 xl:grid-cols-2">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Virtual card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 p-7 text-white">
                      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-400/20 blur-2xl" />

                      <div className="relative">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-200">
                              {card.card_type} CARD
                            </p>

                            <div className="mt-6 h-9 w-12 rounded-md bg-gradient-to-br from-amber-200 to-amber-400 opacity-90" />
                          </div>

                          <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
                            ACTIVE
                          </div>
                        </div>

                        <p className="mt-7 text-xl font-medium tracking-[0.25em]">
                          {card.masked_card}
                        </p>

                        <div className="mt-6 flex items-end justify-between">
                          <div>
                            <p className="text-[10px] uppercase text-blue-200">
                              Valid thru
                            </p>
                            <p className="mt-1 text-sm">
                              {String(card.expiry_month).padStart(2, "0")}/
                              {String(card.expiry_year).slice(-2)}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-[10px] uppercase text-blue-200">
                              Card
                            </p>
                            <p className="mt-1 text-sm">
                              ****{card.last_four_digits}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="p-6">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Available Balance
                          </p>

                          <p className="mt-2 text-3xl font-bold text-slate-900">
                            ₹
                            {Number(
                              card.available_balance || 0
                            ).toFixed(2)}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedCard(card.id);
                            setMessage("");
                            setError("");
                          }}
                          className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                          <Icon name="plus" size={16} />
                          Add Balance
                        </button>
                      </div>

                      {selectedCard === card.id && (
                        <form
                          onSubmit={addBalance}
                          className="mt-5 rounded-xl bg-slate-50 p-4"
                        >
                          <label className="text-sm font-semibold text-slate-700">
                            Add funds
                          </label>

                          <div className="mt-2 flex gap-3">
                            <input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={balanceAmount}
                              onChange={(e) =>
                                setBalanceAmount(e.target.value)
                              }
                              placeholder="Enter amount"
                              required
                              className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            <button
                              type="submit"
                              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                              Add
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent transactions */}
          <section className="mt-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Recent Transactions
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest payment activity.
                </p>
              </div>

              <button
                onClick={() => navigate("/transactions")}
                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
                <Icon name="arrow" size={16} />
              </button>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {transactions.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No transactions yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-50"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                          <Icon name="payment" size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {transaction.transaction_id}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {new Date(
                              transaction.created_at
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-slate-900">
                          ₹{Number(transaction.amount).toFixed(2)}
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            transaction.status === "SUCCESS"
                              ? "bg-green-100 text-green-700"
                              : transaction.status === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Simulation notice */}
          <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
            <p className="text-sm font-semibold text-blue-900">
              Simulation environment
            </p>

            <p className="mt-1 text-xs leading-5 text-blue-700">
              This application is designed for demonstration and testing.
              No real payments, banking credentials or actual card
              transactions are processed.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
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
    arrow: (
      <svg {...common}>
        <path d="M19 12H5" />
        <path d="m11 18-6-6 6-6" />
      </svg>
    ),
    search: (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
    ),
    history: (
      <svg {...common}>
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
    payment: (
      <svg {...common}>
        <path d="M12 3v18" />
        <path d="M17 7c0-2-2-3-5-3s-5 1-5 3 2 3 5 3 5 1 5 3-2 3-5 3-5-1-5-3" />
      </svg>
    ),
  };

  return icons[name] || null;
}

function TransactionHistory() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTransactions = async () => {
    try {
      setError("");

      const params = {};

      if (status) params.status = status;
      if (minAmount) params.min_amount = minAmount;
      if (maxAmount) params.max_amount = maxAmount;

      const response = await api.get("/transactions/", { params });

      setTransactions(response.data);
    } catch (err) {
      setError("Unable to load transaction history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleFilter = async (e) => {
    e.preventDefault();
    setLoading(true);
    await loadTransactions();
  };

  const clearFilters = async () => {
    setStatus("");
    setMinAmount("");
    setMaxAmount("");

    setLoading(true);

    try {
      const response = await api.get("/transactions/");
      setTransactions(response.data);
      setError("");
    } catch {
      setError("Unable to load transaction history.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyle = (transactionStatus) => {
    if (transactionStatus === "SUCCESS") {
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (transactionStatus === "FAILED") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  const totalAmount = transactions
    .filter((transaction) => transaction.status === "SUCCESS")
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
              aria-label="Back to dashboard"
            >
              <Icon name="arrow" size={18} />
            </button>

            <div>
              <p className="text-sm font-semibold text-blue-600">
                Activity
              </p>

              <h1 className="text-xl font-bold text-slate-900">
                Transaction History
              </h1>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="hidden rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:block"
          >
            Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">

        {/* Intro */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Payment activity
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Your transactions
          </h2>

          <p className="mt-2 text-slate-500">
            Review and filter your simulated payment activity.
          </p>
        </section>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Summary */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Transactions shown
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {transactions.length}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Based on your current filters
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 p-6 text-white shadow-lg shadow-blue-900/10">
            <p className="text-sm text-blue-100">
              Successful payment value
            </p>

            <p className="mt-3 text-3xl font-bold">
              ₹{totalAmount.toFixed(2)}
            </p>

            <p className="mt-2 text-xs text-blue-200">
              Successful transactions currently shown
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Icon name="search" size={19} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Filter transactions
              </h3>

              <p className="text-sm text-slate-500">
                Narrow down your payment history.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleFilter}
            className="mt-6 grid gap-4 md:grid-cols-4"
          >
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">All statuses</option>
                <option value="SUCCESS">Success</option>
                <option value="FAILED">Failed</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Minimum amount
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder="₹ 0.00"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Maximum amount
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                placeholder="₹ 10,000"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-end gap-3">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Apply Filters
              </button>

              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          </form>
        </section>

        {/* Transactions */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Transactions
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Complete payment activity for your account.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
          ) : transactions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Icon name="history" size={26} />
              </div>

              <h4 className="mt-4 font-bold text-slate-900">
                No transactions found
              </h4>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your filters or make a payment to see activity here.
              </p>

              <button
                onClick={() => navigate("/payment")}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Make a Payment
              </button>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-slate-200 bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Transaction
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Card
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Amount
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Status
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Date
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {transactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Icon name="payment" size={18} />
                              </div>

                              <div>
                                <p className="font-semibold text-slate-900">
                                  {transaction.transaction_id}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  Transaction #{transaction.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-sm font-medium text-slate-600">
                            •••• {transaction.card}
                          </td>

                          <td className="px-6 py-5 text-sm font-bold text-slate-900">
                            ₹{Number(transaction.amount).toFixed(2)}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                                transaction.status
                              )}`}
                            >
                              {transaction.status}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-500">
                            {formatDate(transaction.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 md:hidden">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Icon name="payment" size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {transaction.transaction_id}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            •••• {transaction.card}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${getStatusStyle(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </div>

                    <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs text-slate-400">
                          Date
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {formatDate(transaction.created_at)}
                        </p>
                      </div>

                      <p className="text-lg font-bold text-slate-900">
                        ₹{Number(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Notice */}
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
          <p className="text-sm font-semibold text-blue-900">
            Simulated payment records
          </p>

          <p className="mt-1 text-xs leading-5 text-blue-700">
            These transactions are generated by the application's
            simulated payment system. No real financial transactions
            are performed.
          </p>
        </div>
      </main>
    </div>
  );
}

export default TransactionHistory;
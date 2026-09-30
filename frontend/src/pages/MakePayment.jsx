import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { fastApi } from "../api";

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
    card: (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
    arrow: (
      <svg {...common}>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    ),
    shield: (
      <svg {...common}>
        <path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    wallet: (
      <svg {...common}>
        <path d="M4 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
        <path d="M4 8h15" />
        <path d="M16 13h4" />
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
  };

  return icons[name] || null;
}

function MakePayment() {
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [form, setForm] = useState({
    card_id: "",
    amount: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [loadingCards, setLoadingCards] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const response = await api.get("/cards/");
        setCards(response.data);
      } catch (err) {
        setError("Unable to load your cards.");
      } finally {
        setLoadingCards(false);
      }
    };

    loadCards();
  }, []);

  const selectedCard = cards.find(
    (card) => card.id === Number(form.card_id)
  );

  const amount = Number(form.amount || 0);

  const remainingBalance = useMemo(() => {
    if (!selectedCard || !amount) return null;

    return Number(selectedCard.available_balance || 0) - amount;
  }, [selectedCard, amount]);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("access_token");

    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Number(payload.user_id);
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setTransactionId("");

    const userId = getUserIdFromToken();

    if (!userId) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    if (!form.card_id || !form.amount) {
      setError("Please select a card and enter an amount.");
      return;
    }

    if (amount <= 0) {
      setError("Payment amount must be greater than zero.");
      return;
    }

    setProcessing(true);

    try {
      const token = localStorage.getItem("access_token");

      const response = await fastApi.post("/payments/", {
        user_id: userId,
        card_id: Number(form.card_id),
        amount: amount,
      });

      const data = await response.data;

      if (!response.ok) {
        throw new Error(
          data.detail || "Payment request failed."
        );
      }

      setTransactionId(data.transaction_id);

      if (data.status === "SUCCESS") {
        setMessage(data.message);
        setError("");

        setForm({
          card_id: "",
          amount: "",
        });
      } else {
        setError(data.message);
        setMessage("");

        setForm({
          card_id: "",
          amount: "",
        });
      }
    } catch (err) {
      setError(
        err.message || "Unable to process payment."
      );
      setMessage("");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Payments
            </p>

            <h1 className="text-xl font-bold text-slate-900">
              Make Payment
            </h1>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Dashboard
            <Icon name="arrow" size={16} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-10">

        {/* Intro */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Secure checkout
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Make a payment
          </h2>

          <p className="mt-2 text-slate-500">
            Choose a saved card and enter the amount you want to
            simulate.
          </p>
        </div>

        {/* Result */}
        {message && (
          <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                <Icon name="check" size={21} />
              </div>

              <div>
                <p className="font-bold text-green-800">
                  Payment successful
                </p>

                <p className="mt-1 text-sm text-green-700">
                  {message}
                </p>

                {transactionId && (
                  <p className="mt-2 text-xs font-medium text-green-600">
                    Transaction ID: {transactionId}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                <Icon name="close" size={19} />
              </div>

              <div>
                <p className="font-bold text-red-800">
                  Payment failed
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>

                {transactionId && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    Transaction ID: {transactionId}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* Payment form */}
          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm lg:p-9">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon name="wallet" />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Payment details
                </h3>

                <p className="text-sm text-slate-500">
                  Enter your payment information
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >

              {/* Card */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Payment card
                </label>

                {loadingCards ? (
                  <div className="mt-2 h-12 animate-pulse rounded-xl bg-slate-100" />
                ) : cards.length === 0 ? (
                  <div className="mt-2 rounded-xl border border-dashed border-slate-300 p-5">
                    <p className="text-sm text-slate-500">
                      You don't have a saved card yet.
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate("/cards/add")}
                      className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Add a card →
                    </button>
                  </div>
                ) : (
                  <select
                    value={form.card_id}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        card_id: e.target.value,
                      })
                    }
                    required
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">
                      Select a card
                    </option>

                    {cards.map((card) => (
                      <option key={card.id} value={card.id}>
                        {card.card_type} •••• {card.last_four_digits} — ₹
                        {Number(card.available_balance || 0).toFixed(2)}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Selected card */}
              {selectedCard && (
                <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-blue-200">
                        {selectedCard.card_type} CARD
                      </p>

                      <div className="mt-5 h-8 w-11 rounded-md bg-gradient-to-br from-amber-200 to-amber-400" />
                    </div>

                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
                      ACTIVE
                    </span>
                  </div>

                  <p className="mt-6 text-lg tracking-[0.25em]">
                    {selectedCard.masked_card}
                  </p>

                  <div className="mt-5">
                    <p className="text-xs text-blue-200">
                      Available balance
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      ₹
                      {Number(
                        selectedCard.available_balance || 0
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              {/* Amount */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Payment amount
                </label>

                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-slate-400">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        amount: e.target.value,
                      })
                    }
                    placeholder="0.00"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white py-4 pl-10 pr-4 text-xl font-semibold text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Remaining balance */}
              {selectedCard && amount > 0 && (
                <div
                  className={`rounded-xl p-4 ${
                    remainingBalance >= 0
                      ? "bg-slate-50"
                      : "bg-red-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Balance after payment
                    </span>

                    <span
                      className={`text-lg font-bold ${
                        remainingBalance >= 0
                          ? "text-slate-900"
                          : "text-red-600"
                      }`}
                    >
                      ₹{remainingBalance.toFixed(2)}
                    </span>
                  </div>

                  {remainingBalance < 0 && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      This amount exceeds your available balance.
                      The payment will fail.
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  processing ||
                  loadingCards ||
                  cards.length === 0
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Processing payment...
                  </>
                ) : (
                  <>
                    Make Payment
                    <Icon name="arrow" size={18} />
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Summary */}
          <aside className="space-y-5">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900">
                Payment summary
              </h3>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Card
                  </span>

                  <span className="font-semibold text-slate-900">
                    {selectedCard
                      ? `•••• ${selectedCard.last_four_digits}`
                      : "Not selected"}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Amount
                  </span>

                  <span className="font-semibold text-slate-900">
                    ₹{amount > 0 ? amount.toFixed(2) : "0.00"}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">
                      Total
                    </span>

                    <span className="text-xl font-bold text-slate-900">
                      ₹{amount > 0 ? amount.toFixed(2) : "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <div className="flex gap-3">
                <div className="text-blue-600">
                  <Icon name="shield" />
                </div>

                <div>
                  <h3 className="font-semibold text-blue-900">
                    Secure simulation
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-blue-700">
                    This is a simulated payment environment.
                    No real money or banking transaction is processed.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Payment flow
              </p>

              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    1
                  </div>
                  <span className="text-sm text-slate-600">
                    Select your saved card
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    2
                  </div>
                  <span className="text-sm text-slate-600">
                    Enter the payment amount
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    3
                  </div>
                  <span className="text-sm text-slate-600">
                    Receive transaction result
                  </span>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </main>
    </div>
  );
}

export default MakePayment;
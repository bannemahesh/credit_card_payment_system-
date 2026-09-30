import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function AddCard() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    card_type: "CREDIT",
    card_number: "",
    cvv: "",
    expiry_month: "",
    expiry_year: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await api.post("/cards/", {
        ...form,
        expiry_month: Number(form.expiry_month),
        expiry_year: Number(form.expiry_year),
      });

      setMessage(
        `Card added successfully: ${response.data.masked_card}`
      );

      setForm({
        card_type: "CREDIT",
        card_number: "",
        cvv: "",
        expiry_month: "",
        expiry_year: "",
      });
    } catch (err) {
      setError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Unable to add card."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">Add Card</h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
          >
            Dashboard
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800">
            Add Credit/Debit Card
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Only masked card information is stored. CVV is never stored.
          </p>

          {message && (
            <div className="mt-5 rounded-lg bg-green-100 p-3 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-lg bg-red-100 p-3 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Card Type
              </label>

              <select
                name="card_type"
                value={form.card_type}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              >
                <option value="CREDIT">Credit</option>
                <option value="DEBIT">Debit</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Card Number
              </label>

              <input
                type="text"
                name="card_number"
                value={form.card_number}
                onChange={handleChange}
                maxLength="19"
                required
                placeholder="Test card number"
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                CVV
              </label>

              <input
                type="password"
                name="cvv"
                value={form.cvv}
                onChange={handleChange}
                maxLength="4"
                required
                placeholder="CVV"
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Expiry Month
                </label>

                <input
                  type="number"
                  name="expiry_month"
                  value={form.expiry_month}
                  onChange={handleChange}
                  min="1"
                  max="12"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Expiry Year
                </label>

                <input
                  type="number"
                  name="expiry_year"
                  value={form.expiry_year}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Save Card
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AddCard;
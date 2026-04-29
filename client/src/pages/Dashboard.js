import { useEffect, useState } from "react";
import { API } from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      const res = await API.get("/api/user/dashboard");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInvest = async () => {
    if (!amount) return;
    await API.post("/api/invest", { amount: Number(amount) });
    setAmount("");
    setMessage("✅ Investment added successfully!");
    fetchData();
  };

  const handleWithdraw = async () => {
    if (!amount) return;

    const res = await API.post("/api/withdraw", {
      amount: Number(amount),
    });

    setMessage(
      `⚠ Coverage changed: ₹${res.data.before.coverage} → ₹${res.data.after.coverage}`
    );

    setAmount("");
    fetchData();
  };

  if (!data)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );

  //const { user, graphData } = data;
    const { user, graphData, investments = [], withdrawals = [] } = data;
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6ec] to-[#f1e7d8] p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          InsureVest 💼
        </h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card title="💰 Investment" value={`₹${user.totalInvestment}`} />
        <Card title="🛡 Coverage" value={`₹${user.insuranceCoverage}`} />
        <Card title="⚡ Multiplier" value={user.multiplier} />
        <Card title="🔥 Streak" value={user.streakCount} />
      </div>

      {/* GRAPH + TIPS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        {/* SMALL GRAPH */}
        <div className="bg-white p-5 rounded-2xl shadow-lg md:col-span-2">
          <h2 className="font-semibold mb-3">📈 Investment Trend</h2>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={graphData || []}>
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* INVESTMENT TIPS */}
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <h2 className="font-semibold mb-3">💡 Smart Tips</h2>

          <ul className="text-sm text-gray-600 space-y-2">
            <li>✔ Invest daily to increase your streak</li>
            <li>✔ Higher streak = better insurance multiplier</li>
            <li>✔ Avoid withdrawing frequently</li>
            <li>✔ Try reaching 7-day and 30-day rewards</li>
          </ul>
        </div>
      </div>

      {/* ACTION + INSURANCE INFO */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* ACTION PANEL */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="font-semibold mb-4">💳 Manage Funds</h2>

          <div className="flex gap-3 flex-wrap">
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-3 border rounded-xl w-40"
            />

            <button
              onClick={handleInvest}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
            >
              Invest
            </button>

            <button
              onClick={handleWithdraw}
              className="bg-red-500 text-white px-5 py-2 rounded-lg"
            >
              Withdraw
            </button>
          </div>

          {message && (
            <div className="mt-4 text-sm bg-yellow-100 p-2 rounded-lg">
              {message}
            </div>
          )}
        </div>

        {/* INSURANCE PROVIDER */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="font-semibold mb-3">🛡 Insurance Provider</h2>

          <p className="text-gray-700 text-sm">
            Your coverage is backed by:
          </p>

          <div className="mt-4 p-4 bg-indigo-50 rounded-xl">
            <p className="font-bold text-indigo-700">
              SecureLife Insurance Co.
            </p>
            <p className="text-sm text-gray-600">
              Trusted digital micro-insurance partner
            </p>
          </div>
        </div>
          {/* TRANSACTION HISTORY */}
<div className="mt-8 bg-white p-6 rounded-2xl shadow-lg">
  <h2 className="font-semibold mb-4">📊 Transaction History</h2>

  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left">
      <thead>
        <tr className="border-b text-gray-600">
          <th className="py-2">Type</th>
          <th className="py-2">Amount</th>
          <th className="py-2">Date</th>
        </tr>
      </thead>

      <tbody>
        {/* Investments */}
        {investments.map((item, i) => (
          <tr key={"inv-" + i} className="border-b">
            <td className="py-2 text-green-600 font-medium">Invest</td>
            <td className="py-2">₹{item.amount}</td>
            <td className="py-2">
              {new Date(item.date).toLocaleDateString()}
            </td>
          </tr>
        ))}

        {/* Withdrawals */}
        {withdrawals.map((item, i) => (
          <tr key={"with-" + i} className="border-b">
            <td className="py-2 text-red-600 font-medium">Withdraw</td>
            <td className="py-2">₹{item.amount}</td>
            <td className="py-2">
              {new Date(item.date).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
      </div>
      <footer className="mt-12 border-t pt-4 flex justify-center items-center gap-2 text-sm text-gray-500 dark:text-black">
  <span>© 2025</span>
  <span className="font-semibold text-gray-700 dark:text-black">Viraj</span>
  <span>• Built with InsureVest</span>
</footer>
    </div>
  );
}

/* CARD */
function Card({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-2xl shadow-lg text-center"
    >
      <h3 className="text-gray-500 text-sm mb-2">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </motion.div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import TransactionChart from "@/components/TransactionChart";
import { Transaction } from "@/types/transaction";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [editId, setEditId] = useState<string | null>(null);

  // -----------------------------
  // ✅ Protected Route
  // -----------------------------
  // This ensures only logged-in users with a token can access this page
  useEffect(() => {
    const token = localStorage.getItem("token"); // check if token exists
    const user = localStorage.getItem("user"); // check if user exists
    if (!token || !user) {
      router.push("/login"); // redirect to login if not authenticated
    } else {
      setUserName(JSON.parse(user).name); // set username if logged in
    }
  }, [router]);

  // -----------------------------
  // Logout function
  // -----------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  // -----------------------------
  // Fetch transactions from API
  // -----------------------------
  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      toast.error("Failed to fetch transactions");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // -----------------------------
  // Calculate totals
  // -----------------------------
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;

  // -----------------------------
  // Reset form after submit
  // -----------------------------
  const resetForm = () => {
    setTitle("");
    setAmount("");
    setType("income");
    setEditId(null);
  };

  // -----------------------------
  // Add/Edit transaction
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !amount || !type) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editId) {
      // Edit existing transaction
      const res = await fetch(`/api/transactions?id=${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, amount: Number(amount), type }),
      });
      const updatedTransaction = await res.json();
      setTransactions(
        transactions.map((t) => (t._id === editId ? updatedTransaction : t))
      );
      setEditId(null);
    } else {
      // Create new transaction
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, amount: Number(amount), type }),
      });
      const newTransaction = await res.json();
      setTransactions([newTransaction, ...transactions]);
    }

    resetForm();
  };

  // -----------------------------
  // Delete transaction
  // -----------------------------
  const handleDelete = async (_id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      const res = await fetch(`/api/transactions?id=${_id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Delete failed");
        return;
      }
      toast.success("Transaction deleted");
      fetchTransactions();
    } catch (error) {
      toast.error("Network error");
    }
  };

  // -----------------------------
  // Edit transaction click
  // -----------------------------
  const handleEdit = (item: Transaction) => {
    setEditId(item._id);
    setTitle(item.title);
    setAmount(item.amount.toString());
    setType(item.type);
  };

  // -----------------------------
  // Dashboard UI
  // -----------------------------
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6">
{/* ---------------- Dashboard Header ---------------- */}
<div className="bg-white rounded-lg p-4 shadow-md w-full max-w-4xl mb-6 flex items-start justify-between">
  <div>
    <h2 className="text-xl font-semibold text-blue-700">
      Welcome back, {userName || "Guest"}!
    </h2>
    <p className="text-gray-500 ">Track your income and expenses below</p>
  </div>
  <button
    onClick={handleLogout}
    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded -mt-1"
  >
    Logout
  </button>
</div>

      {/* Summary Cards */}
      <div className="w-full max-w-4xl flex flex-wrap justify-between gap-4 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 text-center flex-1">
          <p className="text-sm text-gray-500">Income</p>
          <p className="text-2xl font-bold text-green-600">{income}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center flex-1">
          <p className="text-sm text-gray-500">Expenses</p>
          <p className="text-2xl font-bold text-red-600">{expenses}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center flex-1">
          <p className="text-sm text-gray-500">Balance</p>
          <p className="text-2xl font-bold text-blue-600">{balance}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white shadow-md rounded-lg p-6 w-80 lg:w-[40rem] flex flex-col gap-3 mb-8">
        <TransactionChart data={transactions} />
      </div>

      {/* Transaction Form */}
      <TransactionForm
        title={title}
        amount={amount}
        type={type}
        handleSubmit={handleSubmit}
        setTitle={setTitle}
        setAmount={setAmount}
        setType={setType}
      />

      {/* Transaction List */}
      <TransactionList
        transactions={transactions}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </main>
  );
}

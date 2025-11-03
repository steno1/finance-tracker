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
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.push("/login");
    } else {
      setUserName(JSON.parse(user).name);
    }
  }, [router]);

  // -----------------------------
  // Logout
  // -----------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  // -----------------------------
  // ✅ Fetch transactions
  // -----------------------------
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
  // Totals
  // -----------------------------
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  // -----------------------------
  // Reset form
  // -----------------------------
  const resetForm = () => {
    setTitle("");
    setAmount("");
    setType("income");
    setEditId(null);
  };

  // -----------------------------
  // ✅ Add OR Edit
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !amount || !type) {
      toast.error("Please fill all required fields");
      return;
    }

    const token = localStorage.getItem("token");

    if (editId) {
      // ✅ Edit existing transaction
      const res = await fetch(`/api/transactions?id=${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, amount: Number(amount), type }),
      });

      const updatedTransaction = await res.json();
      setTransactions(
        transactions.map((t) => (t._id === editId ? updatedTransaction : t))
      );
      setEditId(null);
    } else {
      // ✅ Create new transaction
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, amount: Number(amount), type }),
      });

      const newTransaction = await res.json();
      setTransactions([newTransaction, ...transactions]);
    }

    resetForm();
  };

  // -----------------------------
  // ✅ Delete
  // -----------------------------
  const handleDelete = async (_id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/transactions?id=${_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
  // Edit button click
  // -----------------------------
  const handleEdit = (item: Transaction) => {
    setEditId(item._id);
    setTitle(item.title);
    setAmount(item.amount.toString());
    setType(item.type);
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6">

      {/* ---------------- Header ---------------- */}
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

      {/* Summary */}
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

      {/* Form */}
      <TransactionForm
        title={title}
        amount={amount}
        type={type}
        handleSubmit={handleSubmit}
        setTitle={setTitle}
        setAmount={setAmount}
        setType={setType}
      />

      {/* List */}
      <TransactionList
        transactions={transactions}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </main>
  );
}

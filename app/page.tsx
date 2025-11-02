"use client";

import { useState, useEffect } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { Transaction } from "@/types/transaction";
import { toast } from "sonner";
import TransactionChart from "@/components/TransactionChart";

export default function Home() {
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [editId, setEditId] = useState<string | null>(null);

  // Calculate totals
  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = income - expenses;

  // Reset form
  const resetForm = () => {
    setTitle("");
    setAmount("");
    setType("income");
    setEditId(null);
  };

  // Fetch all transactions from backend
  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Handle add or edit transaction
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
if (!title.trim() || !amount || !type) {
    toast.error("Please fill all required fields");
    return;
  }
    if (editId) {
      // Update existing transaction
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
const handleDelete = async (_id: string) => {
   if (!confirm("Are you sure you want to delete this transaction?")) return;
  try {
    const res = await fetch(`/api/transactions?id=${_id}`, { method: "DELETE" });

    if (!res.ok) {
      const err = await res.json();
      console.error("DELETE error:", err);
       toast.error(err.error || "Delete failed");
      return;
    }
 toast.success("Transaction deleted ");
    fetchTransactions();
  } catch (error) {
    toast.error("Network error");
  }
};


  // Handle edit click
  const handleEdit = (item: Transaction) => {
    setEditId(item._id); 
    setTitle(item.title);
    setAmount(item.amount.toString());
    setType(item.type);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Finance Tracker</h1>
    <p className="text-lg text-gray-600 mb-8 text-center max-w-md mx-auto">
  Track your income, expenses, and balance easily.
</p>


      <div className="flex flex-wrap justify-center gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 text-center w-60 md:w-72">
          <h2 className="text-lg font-semibold text-gray-700">Income</h2>
          <p className="text-2xl font-bold text-green-600">{income}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center w-60 md:w-72">
          <h2 className="text-lg font-semibold text-gray-700">Expenses</h2>
          <p className="text-2xl font-bold text-red-600">{expenses}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center w-60 md:w-72">
          <h2 className="text-lg font-semibold text-gray-700">Balance</h2>
          <p className="text-2xl font-bold text-blue-600">{balance}</p>
        </div>
      </div>
      
 <div  className="bg-white shadow-md rounded-lg p-6 w-80 lg:w-[40rem] flex flex-col gap-3 mt-8">
  <TransactionChart data={transactions} />
</div>

      {/* Form for add/edit */}
      <TransactionForm
        title={title}
        amount={amount}
        type={type}
        handleSubmit={handleSubmit}
        setTitle={setTitle}
        setAmount={setAmount}
        setType={setType}
      />

      {/* List of transactions */}
      <TransactionList
        transactions={transactions}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      
    </main>
  );
}

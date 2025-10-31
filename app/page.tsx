"use client";

import { useState } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { Transaction } from "@/types/transaction";

export default function Home() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [transactions, setTransaction] = useState<Transaction[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setType("income");
    setEditId(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editId !== null) {
      const updated = transactions.map((item) =>
        item.id === editId
          ? { ...item, title, amount: Number(amount), type }
          : item
      );
      setTransaction(updated);
      resetForm();
    } else {
      const newTransaction = {
        id: Date.now(),
        title,
        amount: Number(amount),
        type,
      };
      setTransaction([...transactions, newTransaction]);
      resetForm();
    }
  };

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = income - expenses;

  const handleDelete = (id: number) => {
    setTransaction(transactions.filter((item) => item.id !== id));
  };

  const handleEdit = (item: Transaction) => {
    setEditId(item.id);
    setTitle(item.title);
    setAmount(item.amount.toString());
    setType(item.type);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Finance Tracker</h1>
         <p className="text-lg text-gray-600 mb-8 text-center">
        Track your income, expenses, and balance easily.
      </p>

      <div className="flex flex-wrap justify-center gap-6">
        <div className="bg-white shadow-md rounded-lg p-6 text-center w-60">
          <h2 className="text-lg font-semibold text-gray-700">Income</h2>
          <p className="text-2xl font-bold text-green-600">{income}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center w-60">
          <h2 className="text-lg font-semibold text-gray-700">Expenses</h2>
          <p className="text-2xl font-bold text-red-600">{expenses}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center w-60">
          <h2 className="text-lg font-semibold text-gray-700">Balance</h2>
          <p className="text-2xl font-bold text-blue-600">{balance}</p>
        </div>
      </div>

      <TransactionForm
        title={title}
        amount={amount}
        type={type}
        handleSubmit={handleSubmit}
        setAmount={setAmount}
        setTitle={setTitle}
        setType={setType}
      />

      <TransactionList
        transactions={transactions}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </main>
  );
}

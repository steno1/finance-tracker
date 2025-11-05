"use client";

import { Transaction } from "@/types/transaction";

type Props = {
  title: string;
  amount: string;
  type: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setTitle: (value: string) => void;
  setAmount: (value: string) => void;
  setType: (value: string) => void;
};

export default function TransactionForm({
  title,
  amount,
  type,
  handleSubmit,
  setTitle,
  setAmount,
  setType,
}: Props) {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl flex flex-col gap-3 mt-8 mx-4 sm:mx-auto"
    >
      <label className="text-gray-700 font-medium">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
      />

      <label className="text-gray-700 font-medium">Amount</label>
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        placeholder="Amount"
        className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
      />

      <label className="text-gray-700 font-medium">Type</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 w-full"
      >
        Add Transaction
      </button>
    </form>
  );
}

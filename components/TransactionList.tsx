"use client";

import { Transaction } from "@/types/transaction";

type Props = {
  transactions: Transaction[];
  handleEdit: (item: Transaction) => void;
  handleDelete: (id: number) => void;
};

export default function TransactionList({ transactions, handleEdit, handleDelete }: Props) {
  return (
    <div className="mt-6 w-80">
      <h2 className="text-xl mb-4 font-semibold text-center">Transactions</h2>
      

      <ul>
        {transactions.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center border-b py-2 px-3"
          >
            <div className="flex flex-col">
              <span className="font-medium">{item.title}</span>
              <span
                className={`text-sm ${
                  item.type === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.type === "income" ? "+" : "-"} ₦{item.amount}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

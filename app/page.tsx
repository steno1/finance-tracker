
"use client";

import { useState } from "react";
 



function Home() {


  const [title, setTitle]=useState("");
  const [amount, setAmount]=useState("")
  const [type, setType]=useState("income");
  const [transaction, setTransaction]=useState<any []>([])

  const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
e.preventDefault()
const newTransaction={
  id: Date.now(),
  title,
  amount:Number(amount),
  type

}
setTransaction([...transaction, newTransaction]);
setTitle("");
setAmount("");
setType("Income");
console.log("new transaction", newTransaction);
console.log("all", transaction)
  }

  const income=transaction.filter(item=>item.type==="income")
  .reduce((sum, item)=>sum+item.amount,0);

  const expenses=transaction.filter(item=>item.type==="expense")
  .reduce((sum, item)=>sum+item.amount, 0)

  const balance =income-expenses;

  const handleDelete=(id:number)=>{
const newTransactions=transaction.filter(item=>item.id !==id);
setTransaction(newTransactions);
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Finance Tracker</h1>
      <p className="text-lg text-gray-600 mb-8">
        Track your income, expenses, and balance easily.
      </p>

      {/* Dashboard Cards */}
      <div className="flex flex-wrap justify-center gap-6">
        {/* Income Card */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center w-60">
          <h2 className="text-lg font-semibold text-gray-700">Income</h2>
          <p className="text-2xl font-bold text-green-600">{income}</p>
        </div>

        {/* Expenses Card */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center w-60">
          <h2 className="text-lg font-semibold text-gray-700">Expenses</h2>
          <p className="text-2xl font-bold text-red-600">{expenses}</p>
        </div>

        {/* Balance Card */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center w-60">
          <h2 className="text-lg font-semibold text-gray-700">Balance</h2>
          <p className="text-2xl font-bold text-blue-600">{balance}</p>
        </div>
      </div>


       {/* Transaction input form */}
      <form 
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 w-80 flex flex-col gap-3 mt-8">

         <label className="text-gray-700 font-medium">
    Title
  </label>
        <input
          type="text"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          placeholder="Title"
          className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
       

         <label className="text-gray-700 font-medium">
    Amount
  </label>

        <input
        value={amount}
        onChange={(e)=>setAmount(e.target.value)}
          type="number"
          placeholder="Amount"
          className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

 <label className="text-gray-700 font-medium">
    Type
  </label>
        <select
        value={type}
        onChange={(e)=>setType(e.target.value)}
          className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
         
          <option value="income">Income</option>
          <option value="expense">Expense</option>


        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
        >
          Add Transaction
        </button>
      </form>
<div className="mt-6 w-80">
  <h2 className="text-xl mb-4 font-semibold text-center">Transactions</h2>
  <ul>
    {transaction.map((item) => (
      <li 
        key={item.id} 
        className="flex justify-between items-center border-b py-2 px-3"
      >
        <div className="flex flex-col">
          <span className="font-medium">{item.title}</span>
          <span className={`text-sm ${item.type === "income" ? "text-green-600" : "text-red-600"}`}>
            {item.type === "Income" ? "+" : "-"}${item.amount}
          </span>
        </div>

        <button
          onClick={() => handleDelete(item.id)}
          className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
        >
          Delete
        </button>
      </li>
    ))}
  </ul>
</div>

    </main>
  );
}

export default Home;

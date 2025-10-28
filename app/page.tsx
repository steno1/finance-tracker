function Home() {
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
          <p className="text-2xl font-bold text-green-600">$0</p>
        </div>

        {/* Expenses Card */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center w-60">
          <h2 className="text-lg font-semibold text-gray-700">Expenses</h2>
          <p className="text-2xl font-bold text-red-600">$0</p>
        </div>

        {/* Balance Card */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center w-60">
          <h2 className="text-lg font-semibold text-gray-700">Balance</h2>
          <p className="text-2xl font-bold text-blue-600">$0</p>
        </div>
      </div>


       {/* Transaction input form */}
      <form className="bg-white shadow-md rounded-lg p-6 w-80 flex flex-col gap-3 mt-8">
        <input
          type="text"
          placeholder="Title"
          className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="number"
          placeholder="Amount"
          className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
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
    </main>
  );
}

export default Home;

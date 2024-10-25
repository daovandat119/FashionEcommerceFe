// src/pages/admin/dashboard/TransactionHistory.jsx
import React from 'react';

const transactions = [
  { id: 1001, category: 'Groceries', date: '2024-08-20', amount: '150$', paymentMethod: 'Credit Card' },
  { id: 1002, category: 'Utilities', date: '2024-08-21', amount: '175$', paymentMethod: 'Bank Transfer' },
  { id: 1003, category: 'Dining', date: '2024-08-22', amount: '120$', paymentMethod: 'Debit Card' },
  { id: 1004, category: 'Transport', date: '2024-08-23', amount: '185$', paymentMethod: 'Cash' },
];

const TransactionHistory = () => {
  return (
    <div className="bg-white rounded-lg border border-black p-4">
      <h3 className="text-lg font-bold mb-4">Transaction History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2 text-left">Transaction Id</th>
              <th className="border border-gray-200 p-2 text-left">Category</th>
              <th className="border border-gray-200 p-2 text-left">Date</th>
              <th className="border border-gray-200 p-2 text-left">Amount</th>
              <th className="border border-gray-200 p-2 text-left">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 p-2">{transaction.id}</td>
                <td className="border border-gray-200 p-2">{transaction.category}</td>
                <td className="border border-gray-200 p-2">{transaction.date}</td>
                <td className="border border-gray-200 p-2">{transaction.amount}</td>
                <td className="border border-gray-200 p-2">{transaction.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <p className="text-gray-600">1-4 of 12</p>
        <div className="flex justify-center mt-2">
          <button className="bg-black text-white px-4 py-2 rounded-l">◀</button>
          <button className="bg-black text-white px-4 py-2 mx-1 rounded">1</button>
          <button className="bg-black text-white px-4 py-2 rounded">2</button>
          <button className="bg-black text-white px-4 py-2 mx-1 rounded">3</button>
          <button className="bg-black text-white px-4 py-2  rounded-r">▶</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;


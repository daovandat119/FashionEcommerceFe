// src/pages/admin/dashboard/CreditBalance.jsx
import React from 'react';

const CreditBalance = () => {
  const balance = 25215;
  const recentTransactions = [
    { title: 'Bill & Taxes', date: 'Today, 16:36', amount: -154.50 },
    { title: 'Car Energy', date: '23 Jun, 13:06', amount: -40.50 },
    { title: 'Design Course', date: '21 Jun, 19:04', amount: -70.00 },
  ];

  return (
    <div className="bg-white rounded-lg border border-black p-4">
      <div className="bg-black text-white p-4 rounded-lg">
        <h3 className="text-lg font-bold text-white">Credit Balance</h3>
        <p className="text-2xl">${balance.toLocaleString()}</p>
        <div className="mt-2">
         
        </div>
      </div>
      <h4 className="mt-4 font-semibold">Recent</h4>
      <ul>
        {recentTransactions.map((transaction, index) => (
          <li key={index} className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-medium">{transaction.title}</p>
              <p className="text-gray-500 text-sm">{transaction.date}</p>
            </div>
            <p className={`font-medium ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
              ${transaction.amount.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreditBalance;


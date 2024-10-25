import React, { useContext } from 'react';
import { OrderContext } from './OrderContext';

export default function AccountOrders() {
  const { orders, loading, error } = useContext(OrderContext);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="col-lg-9">
      <div className="page-content my-account__orders-list">
        {orders.data && orders.data.length > 0 ? (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Status</th>             
                <th>Total Quantity</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.data.map(order => (
                <tr key={order.OrderID}>
                  <td>#{order.OrderID}</td>
                  <td>{order.OrderStatus}</td>             
                  <td>{order.TotalQuantity || '0'} items</td>
                  <td>{order.PaymentStatus || 'N/A'}</td>
                  <td>
                    <button className="btn btn-primary">VIEW</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders found.</p>
        )}
</div>
</div>
  )}
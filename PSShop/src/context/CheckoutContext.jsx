import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const [orderData, setOrderData] = useState({
    AddressID: null,
    products: [],
    PaymentMethodID: 1,
    orderCode: null
  });

  const updateOrderData = (data) => {
    setOrderData(prev => ({...prev, ...data}));
  };

  return (
    <CheckoutContext.Provider value={{ orderData, updateOrderData }}>
      {children}
    </CheckoutContext.Provider>
  );
}

CheckoutProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useCheckout = () => useContext(CheckoutContext);
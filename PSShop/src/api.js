// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/cart'; // Đảm bảo cổng phù hợp với json-server

export const getCart = () => axios.get(API_URL);

export const addToCart = (product) => axios.post(API_URL, product);

export const updateCartItem = (id, updatedProduct) => axios.put(`${API_URL}/${id}`, updatedProduct);

export const removeFromCart = (id) => axios.delete(`${API_URL}/${id}`);

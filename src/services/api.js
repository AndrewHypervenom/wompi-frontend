import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const createPaymentSource = async (cardData) => {
  try {
    const response = await api.post('/payment-sources', cardData);
    return response.data;
  } catch (error) {
    console.error('Error creating payment source:', error);
    throw error;
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post('/transacciones', transactionData);
    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

export const getTransaction = async (transactionId) => {
  try {
    const response = await api.get(`/transacciones/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting transaction:', error);
    throw error;
  }
};

export default api;
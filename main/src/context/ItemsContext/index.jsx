/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useEffect, useState } from 'react';

import axios from 'src/utils/axios';

export const ItemsContext = createContext(undefined);

// eslint-disable-next-line react/prop-types
export const InvoiceProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching invoices...');
        const response = await axios.get('/invoice');
        console.log('Invoices fetched:', response.data);
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to delete an item
  const deleteItems= async (id) => {
    try {
      setLoading(true);
      console.log('Deleting item with ID:', id);
      await axios.delete(`/api/items/${id}`);
      setItems((prevItems) => 
        prevItems.filter((item) => 
          item._id !== id && item.id !== id
        )
      );
    } catch (error) {
      console.error('Error deleting invoice:', error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const addItems = async (newItem) => {
    try {
      setLoading(true);
      const response = await axios.post('/items', newItem);
      const addedItems = response.data;
      setItems((prevItems) => [...prevItems, addedItems]);
    } catch (error) {
      console.error('Error adding invoice:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  //  Function to update an invoice
  const updateItems = async (updatedItem) => {
    try {
      setLoading(true);
      const response = await axios.put(`/invoice/${updatedItem._id || updatedItem.id}`, updatedItem);
      const updated = response.data;
      setItems((prevItems) =>
        prevItems.map((item) => 
          (item._id === updated._id || item.id === updated.id) ? updated : item
        ),
      );
    } catch (error) {
      console.error('Error updating invoice:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ItemsContext.Provider
      value={{ items, loading, error, deleteItems, addItems, updateItems }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

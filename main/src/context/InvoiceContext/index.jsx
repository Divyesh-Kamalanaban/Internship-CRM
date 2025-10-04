/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useEffect, useState } from 'react';

import axios from 'src/utils/axios';

export const InvoiceContext = createContext(undefined);

// eslint-disable-next-line react/prop-types
export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching invoices...');
        const response = await axios.get('/invoice');
        console.log('Invoices fetched:', response.data);
        setInvoices(response.data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to delete an invoice
  const deleteInvoice = async (id) => {
    try {
      setLoading(true);
      console.log('Deleting invoice with ID:', id);
      await axios.delete(`/api/invoice/${id}`);
      setInvoices((prevInvoices) => 
        prevInvoices.filter((invoice) => 
          invoice._id !== id && invoice.id !== id
        )
      );
    } catch (error) {
      console.error('Error deleting invoice:', error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const addInvoice = async (newInvoice) => {
    try {
      setLoading(true);
      const response = await axios.post('/invoice', newInvoice);
      const addedInvoice = response.data;
      setInvoices((prevInvoices) => [...prevInvoices, addedInvoice]);
    } catch (error) {
      console.error('Error adding invoice:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  //  Function to update an invoice
  const updateInvoice = async (updatedInvoice) => {
    try {
      setLoading(true);
      const response = await axios.put(`/invoice/${updatedInvoice._id || updatedInvoice.id}`, updatedInvoice);
      const updated = response.data;
      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) => 
          (invoice._id === updated._id || invoice.id === updated.id) ? updated : invoice
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
    <InvoiceContext.Provider
      value={{ invoices, loading, error, deleteInvoice, addInvoice, updateInvoice }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { estimateService, creditNoteService, paymentService } from '../../services/api';

const AppContext = createContext();

export { AppContext };

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [estimates, setEstimates] = useState([]);
  const [creditNotes, setCreditNotes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estimate operations
  const fetchEstimates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await estimateService.getAllEstimates();
      setEstimates(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEstimate = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await estimateService.createEstimate(data);
      setEstimates((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEstimate = useCallback(async (updatedEstimate) => {
    try {
      setLoading(true);
      const response = await estimateService.updateEstimate(updatedEstimate._id, updatedEstimate);
      setEstimates((prev) =>
        prev.map((estimate) => (estimate._id === updatedEstimate._id ? response.data : estimate))
      );
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEstimate = useCallback(async (id) => {
    try {
      setLoading(true);
      await estimateService.deleteEstimate(id);
      setEstimates((prev) => prev.filter((estimate) => estimate._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Credit Note operations
  const fetchCreditNotes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await creditNoteService.getAllCreditNotes();
      setCreditNotes(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCreditNote = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await creditNoteService.createCreditNote(data);
      setCreditNotes((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCreditNote = useCallback(async (updatedCreditNote) => {
    try {
      setLoading(true);
      const response = await creditNoteService.updateCreditNote(updatedCreditNote._id, updatedCreditNote);
      setCreditNotes((prev) =>
        prev.map((creditNote) => (creditNote._id === updatedCreditNote._id ? response.data : creditNote))
      );
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCreditNote = useCallback(async (id) => {
    try {
      setLoading(true);
      await creditNoteService.deleteCreditNote(id);
      setCreditNotes((prev) => prev.filter((creditNote) => creditNote._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Payment operations
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await paymentService.getAllPayments();
      setPayments(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPayment = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await paymentService.createPayment(data);
      setPayments((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePayment = useCallback(async (updatedPayment) => {
    try {
      setLoading(true);
      const response = await paymentService.updatePayment(updatedPayment._id, updatedPayment);
      setPayments((prev) =>
        prev.map((payment) => (payment._id === updatedPayment._id ? response.data : payment))
      );
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePayment = useCallback(async (id) => {
    try {
      setLoading(true);
      await paymentService.deletePayment(id);
      setPayments((prev) => prev.filter((payment) => payment._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPayment = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await paymentService.getPayment(id);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    estimates,
    creditNotes,
    payments,
    loading,
    error,
    fetchEstimates,
    createEstimate,
    updateEstimate,
    deleteEstimate,
    fetchCreditNotes,
    createCreditNote,
    updateCreditNote,
    deleteCreditNote,
    fetchPayments,
    createPayment,
    updatePayment,
    deletePayment,
    fetchPayment
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
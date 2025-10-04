/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Snackbar,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from '@mui/material';
import { useAppContext } from 'src/context/AppContext';
import { InvoiceContext } from 'src/context/InvoiceContext';
import { paymentService } from 'src/services/api';

const EditPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updatePayment, fetchPayment } = useAppContext();
  const { invoices } = useContext(InvoiceContext);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: '',
    invoiceId: '',
    amount: '',
    paymentDate: '',
    paymentMethod: '',
    reference: '',
    notes: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const payment = await fetchPayment(id);
        
        if (payment) {
          setFormData({
            id: payment.id,
            invoiceId: payment.invoiceId || '',
            amount: payment.amount || '',
            paymentDate: payment.paymentDate ? new Date(payment.paymentDate).toISOString().split('T')[0] : '',
            paymentMethod: payment.paymentMethod || '',
            reference: payment.reference || '',
            notes: payment.notes || '',
          });
        } else {
          setAlert({
            open: true,
            message: 'Payment not found',
            severity: 'error',
          });
          setTimeout(() => {
            navigate('/apps/payments');
          }, 2000);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setAlert({
          open: true,
          message: 'Error loading payment details',
          severity: 'error',
        });
        setTimeout(() => {
          navigate('/apps/payments');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, fetchPayment, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting payment update with ID:', id);
      console.log('Form data:', formData);
      
      const paymentData = {
        ...formData,
        amount: parseFloat(formData.amount),
        paymentDate: new Date(formData.paymentDate).toISOString(),
      };
      
      // Remove any undefined or null values
      Object.keys(paymentData).forEach(key => {
        if (paymentData[key] === undefined || paymentData[key] === null) {
          delete paymentData[key];
        }
      });
      
      console.log('Payment data to be sent:', paymentData);
      
      const response = await paymentService.updatePayment(id, paymentData);
      console.log('Payment updated successfully:', response.data);
      
      setAlert({
        open: true,
        message: 'Payment updated successfully',
        severity: 'success',
      });
      
      setTimeout(() => {
        navigate('/apps/payments');
      }, 2000);
    } catch (error) {
      console.error('Error updating payment:', error);
      setAlert({
        open: true,
        message: error.response?.data?.message || error.message || 'Error updating payment',
        severity: 'error',
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Edit Payment
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Invoice</InputLabel>
            <Select
              name="invoiceId"
              value={formData.invoiceId}
              onChange={handleChange}
              label="Invoice"
              required
            >
              {invoices && invoices.map((invoice) => (
                <MenuItem key={invoice._id} value={invoice._id}>
                  Invoice #{invoice.id} - {invoice.billFrom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Payment Date"
            name="paymentDate"
            type="date"
            value={formData.paymentDate}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              label="Payment Method"
              required
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              <MenuItem value="Credit Card">Credit Card</MenuItem>
              <MenuItem value="Check">Check</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Reference"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            name="notes"
            multiline
            rows={4}
            value={formData.notes}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/apps/payments')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update Payment
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditPayment; 
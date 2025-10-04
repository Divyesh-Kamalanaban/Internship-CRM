/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import {
  Alert,
  Button,
  MenuItem,
  Typography,
  Box,
  Stack,
  Divider,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format, isValid } from 'date-fns';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { paymentService } from 'src/services/api';

const CreatePayment = () => {
  const router = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'Bank Transfer',
    status: 'Pending',
    paymentDate: new Date().toISOString().split('T')[0],
    paidBy: '',
    paidByEmail: '',
    paidByPhone: '',
    notes: '',
    transactionId: '',
    invoiceId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const paymentData = {
        amount: parseFloat(formData.amount) || 0,
        paymentMethod: formData.paymentMethod,
        status: formData.status,
        paymentDate: new Date(formData.paymentDate).toISOString(),
        paidBy: formData.paidBy || '',
        paidByEmail: formData.paidByEmail || '',
        paidByPhone: formData.paidByPhone || '',
        notes: formData.notes || '',
        transactionId: formData.transactionId || '',
        invoiceId: formData.invoiceId || null
      };

      const response = await paymentService.createPayment(paymentData);
      
      if (response && response.data) {
        setShowAlert(true);
        setTimeout(() => {
          router('/apps/payments/list');
        }, 2000);
      } else {
        throw new Error('Failed to create payment');
      }
    } catch (error) {
      console.error('Error adding payment:', error);
      alert('Error creating payment: ' + (error.response?.data?.message || error.message || 'Unknown error occurred'));
    }
  };

  const parsedDate = isValid(new Date(formData.paymentDate)) ? new Date(formData.paymentDate) : new Date();
  const formattedPaymentDate = format(parsedDate, 'EEEE, MMMM dd, yyyy');

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box>
          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 2, md: 4 }}
            justifyContent="space-between"
            mb={3}
          >
            <Typography variant="h5">Payment #{formData.id}</Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  router('/apps/payments/list');
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Record Payment
              </Button>
            </Box>
          </Stack>
          <Divider />

          <Grid container spacing={3} mt={2}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="reference-invoice">Invoice ID</CustomFormLabel>
              <CustomTextField
                id="reference-invoice"
                name="invoiceId"
                value={formData.invoiceId}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="amount">Payment Amount</CustomFormLabel>
              <CustomTextField
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="payment-method">Payment Method</CustomFormLabel>
              <CustomSelect
                labelId="payment-method-label"
                id="payment-method"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                <MenuItem value="Credit Card">Credit Card</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Check">Check</MenuItem>
                <MenuItem value="PayPal">PayPal</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="payment-status">Payment Status</CustomFormLabel>
              <CustomSelect
                labelId="payment-status-label"
                id="payment-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Failed">Failed</MenuItem>
                <MenuItem value="Refunded">Refunded</MenuItem>
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="paid-by">Paid By</CustomFormLabel>
              <CustomTextField
                id="paid-by"
                name="paidBy"
                value={formData.paidBy}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="paid-by-email">Paid By Email</CustomFormLabel>
              <CustomTextField
                id="paid-by-email"
                name="paidByEmail"
                value={formData.paidByEmail}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="paid-by-phone">Paid By Phone</CustomFormLabel>
              <CustomTextField
                id="paid-by-phone"
                name="paidByPhone"
                value={formData.paidByPhone}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="transaction-id">Transaction ID</CustomFormLabel>
              <CustomTextField
                id="transaction-id"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="notes">Notes</CustomFormLabel>
              <CustomTextField
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
              />
            </Grid>
          </Grid>

          <Box p={3} bgcolor="primary.light" mt={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" fontWeight={600}>
                Payment Date:
              </Typography>
              <Typography variant="body1">{formattedPaymentDate}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Typography variant="body1" fontWeight={600}>
                Total Amount:
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {formData.amount || '0.00'}
              </Typography>
            </Box>
          </Box>

          {showAlert && (
            <Alert severity="success" sx={{ position: 'fixed', top: 16, right: 16 }}>
              Payment recorded successfully.
            </Alert>
          )}
        </Box>
      </form>
    </>
  );
};

export default CreatePayment;
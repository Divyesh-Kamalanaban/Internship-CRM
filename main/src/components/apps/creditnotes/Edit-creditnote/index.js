/* eslint-disable no-unused-vars */

import React, { useContext, useState, useEffect } from 'react';
import { useAppContext } from 'src/context/AppContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  IconButton,
  Tooltip,
  Box,
  Stack,
  Divider,
  Grid,
  Snackbar,
} from '@mui/material';
import { format, isValid } from 'date-fns';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { IconSquareRoundedPlus, IconTrash, IconPlus } from '@tabler/icons';
import { InvoiceContext } from 'src/context/InvoiceContext';
import { creditNoteService } from 'src/services/api';

const EditCreditNote = () => {
  const router = useNavigate();
  const { id } = useParams();
  const { estimates, fetchEstimates } = useAppContext();
  const invoiceContext = useContext(InvoiceContext);
  const invoices = invoiceContext?.invoices || [];
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [formData, setFormData] = useState({
    id: Date.now(),
    amount: 0,
    issueDate: new Date().toISOString().split('T')[0],
    reason: '',
    description: '',
    status: 'Draft',
    currency: 'INR',
    items: [],
    subtotal: 0,
    tax: 0,
    totalAmount: 0,
    notes: '',
    terms: '',
    issuedBy: '',
    issuedTo: {
      name: '',
      email: '',
      address: '',
      phone: ''
    }
  });

  useEffect(() => {
    const fetchCreditNote = async () => {
      try {
        const response = await creditNoteService.getCreditNote(id);
        const creditNote = response.data;
        setFormData({
          ...creditNote,
          issueDate: new Date(creditNote.issueDate).toISOString().split('T')[0],
        });
      } catch (error) {
        console.error('Error fetching credit note:', error);
        setAlertMessage('Error fetching credit note: ' + error.message);
        setAlertSeverity('error');
        setShowAlert(true);
      }
    };

    fetchCreditNote();
    fetchEstimates();
  }, [id, fetchEstimates]);

  const calculateTotals = (items) => {
    if (!items || !Array.isArray(items)) {
      return { subtotal: 0, tax: 0, totalAmount: 0 };
    }

    let subtotal = 0;
    items.forEach((item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      item.totalPrice = quantity * unitPrice;
      subtotal += item.totalPrice;
    });

    const tax = subtotal * 0.1;
    const totalAmount = subtotal + tax;

    return { subtotal, tax, totalAmount };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newFormData = { ...prevData, [name]: value };
      if (newFormData.items && newFormData.items.length > 0) {
        const totals = calculateTotals(newFormData.items);
        return {
          ...newFormData,
          ...totals,
        };
      }
      return newFormData;
    });
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prevData) => {
      if (!prevData.items || !Array.isArray(prevData.items)) {
        return prevData;
      }

      const updatedItems = [...prevData.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };

      if (field === 'unitPrice' || field === 'quantity') {
        const quantity = parseFloat(updatedItems[index].quantity) || 0;
        const unitPrice = parseFloat(updatedItems[index].unitPrice) || 0;
        updatedItems[index].totalPrice = quantity * unitPrice;
      }

      const totals = calculateTotals(updatedItems);
      return {
        ...prevData,
        items: updatedItems,
        ...totals,
      };
    });
  };

  const handleAddItem = () => {
    setFormData((prevData) => {
      const updatedItems = [
        ...prevData.items,
        { itemName: '', description: '', quantity: 0, unitPrice: 0, totalPrice: 0 },
      ];
      const totals = calculateTotals(updatedItems);
      return {
        ...prevData,
        items: updatedItems,
        ...totals,
      };
    });
  };

  const handleDeleteItem = (index) => {
    setFormData((prevData) => {
      const updatedItems = prevData.items.filter((_, i) => i !== index);
      const totals = calculateTotals(updatedItems);
      return {
        ...prevData,
        items: updatedItems,
        ...totals,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const creditNoteData = {
        ...formData,
        amount: formData.totalAmount,
        items: formData.items.map(item => ({
          itemName: item.itemName,
          description: item.description || '',
          quantity: parseInt(item.quantity) || 0,
          unitPrice: parseFloat(item.unitPrice) || 0,
          totalPrice: parseFloat(item.totalPrice) || 0
        })),
        issueDate: new Date(formData.issueDate).toISOString(),
        status: formData.status,
        currency: formData.currency
      };

      delete creditNoteData.invoiceId;
      delete creditNoteData.estimateId;

      if (selectedReferenceType === 'invoice' && formData.referenceInvoice && formData.referenceInvoice.trim() !== '') {
        creditNoteData.invoiceId = formData.referenceInvoice;
      }
      
      if (selectedReferenceType === 'estimate' && formData.estimateId && formData.estimateId.trim() !== '') {
        creditNoteData.estimateId = formData.estimateId;
      }

      await creditNoteService.updateCreditNote(id, creditNoteData);
      setAlertMessage('Credit note updated successfully');
      setAlertSeverity('success');
      setShowAlert(true);
      setTimeout(() => {
        router('/apps/creditnotes/list');
      }, 2000);
    } catch (error) {
      console.error('Error updating credit note:', error);
      setAlertMessage('Error updating credit note: ' + error.message);
      setAlertSeverity('error');
      setShowAlert(true);
    }
  };

  const parsedDate = isValid(new Date(formData.date)) ? new Date(formData.date) : new Date();
  const formattedOrderDate = format(parsedDate, 'EEEE, MMMM dd, yyyy');

  const [selectedReferenceType, setSelectedReferenceType] = useState('estimate');

  return (
    <>
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowAlert(false)} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <form onSubmit={handleSubmit}>
        <Box>
          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 2, md: 4 }}
            justifyContent="space-between"
            mb={3}
          >
            <Typography variant="h5"># {formData.id}</Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  router('/apps/creditnotes/list');
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Update Credit Note
              </Button>
            </Box>
          </Stack>
          <Divider />

          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 2, md: 4 }}
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Box>
              <CustomFormLabel htmlFor="status">Credit Note Status</CustomFormLabel>
              <CustomSelect
                labelId="status-label"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Issued">Issued</MenuItem>
                <MenuItem value="Refunded">Refunded</MenuItem>
                <MenuItem value="Void">Void</MenuItem>
              </CustomSelect>
            </Box>
            <Box textAlign="right">
              <CustomFormLabel>Date</CustomFormLabel>
              <Typography variant="body1">{formattedOrderDate}</Typography>
            </Box>
          </Stack>
          <Divider />

          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="reason">Credit Note Reason</CustomFormLabel>
              <CustomSelect
                labelId="reason-label"
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="Overpayment">Overpayment</MenuItem>
                <MenuItem value="Return">Return</MenuItem>
                <MenuItem value="Cancellation">Cancellation</MenuItem>
                <MenuItem value="Adjustment">Adjustment</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </CustomSelect>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="issued-by">Issued By</CustomFormLabel>
              <CustomTextField
                id="issued-by"
                name="issuedBy"
                value={formData.issuedBy}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="issued-to-name">Issued To Name</CustomFormLabel>
              <CustomTextField
                id="issued-to-name"
                name="issuedTo.name"
                value={formData.issuedTo.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  issuedTo: { ...prev.issuedTo, name: e.target.value }
                }))}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="issued-to-email">Issued To Email</CustomFormLabel>
              <CustomTextField
                id="issued-to-email"
                name="issuedTo.email"
                type="email"
                value={formData.issuedTo.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  issuedTo: { ...prev.issuedTo, email: e.target.value }
                }))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="issued-to-address">Issued To Address</CustomFormLabel>
              <CustomTextField
                id="issued-to-address"
                name="issuedTo.address"
                value={formData.issuedTo.address}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  issuedTo: { ...prev.issuedTo, address: e.target.value }
                }))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="issued-to-phone">Issued To Phone</CustomFormLabel>
              <CustomTextField
                id="issued-to-phone"
                name="issuedTo.phone"
                value={formData.issuedTo.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  issuedTo: { ...prev.issuedTo, phone: e.target.value }
                }))}
                fullWidth
              />
            </Grid>
          </Grid>

          <Box mb={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Items</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<IconPlus />}
                onClick={handleAddItem}
              >
                Add Item
              </Button>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Unit Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <CustomTextField
                          type="text"
                          value={item.itemName}
                          placeholder="Item Name"
                          onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          type="text"
                          value={item.description}
                          placeholder="Description"
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          type="number"
                          value={item.unitPrice}
                          placeholder="0.00"
                          onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          type="number"
                          value={item.quantity}
                          placeholder="0"
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography>
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR'
                          }).format(item.totalPrice)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteItem(index)}
                        >
                          <IconTrash size="18" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box mt={4}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
                <CustomFormLabel htmlFor="terms">Terms & Conditions</CustomFormLabel>
                <CustomTextField
                  id="terms"
                  name="terms"
                  value={formData.terms}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>

          <Box mt={4} display="flex" justifyContent="flex-end">
            <Stack spacing={2} width={300}>
              <Box display="flex" justifyContent="space-between">
                <Typography>Subtotal:</Typography>
                <Typography>${formData.subtotal.toFixed(2)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Tax (10%):</Typography>
                <Typography>${formData.tax.toFixed(2)}</Typography>
              </Box>
              <Divider />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Total Amount:</Typography>
                <Typography variant="h6" color="primary">
                  ${formData.totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </form>
    </>
  );
};

export default EditCreditNote; 
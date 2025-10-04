/* eslint-disable no-unused-vars */

import React, { useState, useContext, useEffect } from 'react';
import {
  Alert,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Stack,
  Divider,
  Grid,
  Snackbar,
} from '@mui/material';
import { InvoiceContext } from 'src/context/InvoiceContext';
import { useNavigate } from 'react-router-dom';
import { format, isValid } from 'date-fns';
import { IconPlus, IconSquareRoundedPlus, IconTrash } from '@tabler/icons';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { useAppContext } from 'src/context/AppContext';
import { creditNoteService } from 'src/services/api';

const CreateCreditNote = () => {
  const router = useNavigate();
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
      // Only calculate totals if we have items
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
      // Create a clean copy of formData without the reference fields
      const creditNoteData = {
        ...formData,
        // Generate a unique ID based on timestamp
        id: Date.now(),
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

      // Remove invoiceId and estimateId from the data if they're empty strings
      delete creditNoteData.invoiceId;
      delete creditNoteData.estimateId;

      // Only add these fields if they have valid values
      if (selectedReferenceType === 'invoice' && formData.referenceInvoice && formData.referenceInvoice.trim() !== '') {
        creditNoteData.invoiceId = formData.referenceInvoice;
      }
      
      if (selectedReferenceType === 'estimate' && formData.estimateId && formData.estimateId.trim() !== '') {
        creditNoteData.estimateId = formData.estimateId;
      }

      const response = await creditNoteService.createCreditNote(creditNoteData);
      setAlertMessage('Credit note created successfully');
      setAlertSeverity('success');
      setShowAlert(true);
      setTimeout(() => {
        router('/apps/creditnotes/list');
      }, 2000);
    } catch (error) {
      console.error('Error adding credit note:', error);
      setAlertMessage('Error creating credit note: ' + error.message);
      setAlertSeverity('error');
      setShowAlert(true);
    }
  };

  const parsedDate = isValid(new Date(formData.date)) ? new Date(formData.date) : new Date();
  const formattedOrderDate = format(parsedDate, 'EEEE, MMMM dd, yyyy');

  useEffect(() => {
    fetchEstimates();
  }, [fetchEstimates]);

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
                Create Credit Note
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
            {/* <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="reference-type">Reference Type</CustomFormLabel>
              <CustomSelect
                labelId="reference-type-label"
                id="reference-type"
                name="referenceType"
                value={selectedReferenceType}
                onChange={(e) => setSelectedReferenceType(e.target.value)}
                fullWidth
              >
                <MenuItem value="estimate">Estimate</MenuItem>
                <MenuItem value="invoice">Invoice</MenuItem>
              </CustomSelect>

              {selectedReferenceType === 'estimate' ? (
                <>
                  <CustomFormLabel htmlFor="reference-estimate" sx={{ mt: 2 }}>Reference Estimate #</CustomFormLabel>
                  <CustomSelect
                    labelId="estimate-label"
                    id="estimateId"
                    name="estimateId"
                    value={formData.estimateId || ''}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value="">Select an estimate</MenuItem>
                    {estimates.map((estimate) => (
                      <MenuItem key={estimate._id} value={estimate._id}>
                        {estimate.estimateNumber}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </>
              ) : (
                <>
                  <CustomFormLabel htmlFor="reference-invoice" sx={{ mt: 2 }}>Reference Invoice #</CustomSelect>
                  <CustomSelect
                    labelId="invoice-label"
                    id="referenceInvoice"
                    name="referenceInvoice"
                    value={formData.referenceInvoice || ''}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value="">Select an invoice</MenuItem>
                    {invoices.map((invoice) => (
                      <MenuItem key={invoice._id} value={invoice._id}>
                        {invoice.id}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </>
              )
            </Grid> */}
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

          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Items Details:</Typography>
            <Button
              onClick={handleAddItem}
              variant="contained"
              color="primary"
              startIcon={<IconPlus width={18} />}
            >
              Add Item
            </Button>
          </Stack>

          <Paper variant="outlined">
            <TableContainer sx={{ whiteSpace: { xs: 'nowrap', md: 'unset' } }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6" fontSize="14px">
                        Item Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" fontSize="14px">
                        Description
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" fontSize="14px">
                        Unit Price
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" fontSize="14px">
                        Units
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" fontSize="14px">
                        Total Cost
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" fontSize="14px">
                        Actions
                      </Typography>
                    </TableCell>
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
                        {formData.items.length === 1 ? (
                          <span>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteItem(index)}
                              disabled
                            >
                              <IconTrash width={18} />
                            </IconButton>
                          </span>
                        ) : (
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteItem(index)}
                            >
                              <IconTrash width={18} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

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

export default CreateCreditNote;
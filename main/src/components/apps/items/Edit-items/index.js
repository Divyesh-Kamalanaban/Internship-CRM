/* eslint-disable no-unused-vars */

import React, { useContext, useState, useEffect } from 'react';
import { InvoiceContext } from 'src/context/InvoiceContext/index';
import { useLocation, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { format, isValid } from 'date-fns';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { IconSquareRoundedPlus, IconTrash } from '@tabler/icons';

const EditInvoicePage = () => {
  const { invoices, updateInvoice } = useContext(InvoiceContext);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields
    if (!editedInvoice.billFrom) newErrors.billFrom = 'Bill From is required';
    if (!editedInvoice.billTo) newErrors.billTo = 'Bill To is required';
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedInvoice.billFromEmail)) {
      newErrors.billFromEmail = 'Invalid email format';
    }
    if (!emailRegex.test(editedInvoice.billToEmail)) {
      newErrors.billToEmail = 'Invalid email format';
    }
    
    // Validate phone numbers
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/;
    if (editedInvoice.billFromPhone && !phoneRegex.test(editedInvoice.billFromPhone)) {
      newErrors.billFromPhone = 'Invalid phone number';
    }
    if (editedInvoice.billToPhone && !phoneRegex.test(editedInvoice.billToPhone)) {
      newErrors.billToPhone = 'Invalid phone number';
    }
    
    // Validate addresses
    if (!editedInvoice.billFromAddress) newErrors.billFromAddress = 'From Address is required';
    if (!editedInvoice.billToAddress) newErrors.billToAddress = 'To Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const title = useLocation();
  const getTitle = title.pathname.split('/').pop();

  useEffect(() => {
    if (invoices.length > 0) {
      // If there's a specific item to edit, use it
      if (getTitle) {
        const invoice = invoices.find((inv) => inv.billFrom === getTitle);
        if (invoice) {
          setSelectedInvoice(invoice);
          setEditedInvoice({ ...invoice });
          setEditing(true);
        } else {
          // If specific item not found, fallback to default
          setSelectedInvoice(invoices[0]);
          setEditedInvoice({ ...invoices[0] });
          setEditing(true);
        }
      } else {
        // No specific item, default to the first invoice
        setSelectedInvoice(invoices[0]);
        setEditedInvoice({ ...invoices[0] });
        setEditing(true);
      }
    }
  }, [getTitle, invoices]);

  const router = useNavigate();

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      console.log('Saving invoice with data:', editedInvoice);
      await updateInvoice(editedInvoice);
      console.log('Invoice updated successfully');
      setSelectedInvoice({ ...editedInvoice });
      setEditing(false); // Exit editing mode
      setShowAlert(true);

      // Navigate to the list page
      router('/apps/invoice/list');
    } catch (error) {
      console.error('Error updating invoice:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      // Show error alert to user
      setShowAlert(true);
      setErrors({ submit: error.response?.data?.message || 'Failed to update invoice' });
    }

    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleOrderChange = (index, field, value) => {
    const updatedOrders = [...editedInvoice.orders];
    updatedOrders[index][field] = value;

    // Clear any previous errors for this field
    const newErrors = { ...errors };
    delete newErrors[`orders.${index}.${field}`];

    // Validate the field
    if (field === 'itemName' && !value) {
      newErrors[`orders.${index}.${field}`] = 'Item name is required';
    } else if (field === 'unitPrice') {
      if (!value || value <= 0) {
        newErrors[`orders.${index}.${field}`] = 'Price must be greater than 0';
      }
    } else if (field === 'units') {
      if (!value || value <= 0) {
        newErrors[`orders.${index}.${field}`] = 'Quantity must be greater than 0';
      }
    }

    setErrors(newErrors);

    // Calculate unitTotalPrice for the changed item
    if (field === 'unitPrice' || field === 'units') {
      updatedOrders[index].unitTotalPrice =
        updatedOrders[index].unitPrice * updatedOrders[index].units;
    }

    // Update editedInvoice with updated orders and recalculate totals
    const updatedInvoice = {
      ...editedInvoice,
      orders: updatedOrders,
      totalCost: calculateTotalCost(updatedOrders),
      vat: calculateVAT(updatedOrders),
      grandTotal: calculateGrandTotal(
        calculateTotalCost(updatedOrders),
        calculateVAT(updatedOrders),
      ),
    };

    setEditedInvoice(updatedInvoice);
  };

  const handleAddItem = () => {
    const newItem = {
      itemName: '',
      unitPrice: 0,
      units: 0,
      unitTotalPrice: 0,
      vat: 0,
    };
    const updatedOrders = [...editedInvoice.orders, newItem];

    // Update editedInvoice with updated orders and recalculate totals
    const updatedInvoice = {
      ...editedInvoice,
      orders: updatedOrders,
      totalCost: calculateTotalCost(updatedOrders),
      vat: calculateVAT(updatedOrders),
      grandTotal: calculateGrandTotal(
        calculateTotalCost(updatedOrders),
        calculateVAT(updatedOrders),
      ),
    };
    setEditedInvoice(updatedInvoice);
  };

  const handleDeleteItem = (index) => {
    const updatedOrders = editedInvoice.orders.filter((_, i) => i !== index);

    const updatedInvoice = {
      ...editedInvoice,
      orders: updatedOrders,
      totalCost: calculateTotalCost(updatedOrders),
      vat: calculateVAT(updatedOrders),
      grandTotal: calculateGrandTotal(
        calculateTotalCost(updatedOrders),
        calculateVAT(updatedOrders),
      ),
    };
    setEditedInvoice(updatedInvoice);
  };

  const calculateTotalCost = (orders) => {
    return orders.reduce((total, order) => total + order.unitTotalPrice, 0);
  };

  const calculateVAT = (orders) => {
    return orders.reduce((totalVAT, order) => totalVAT + order.units, 0);
  };

  const calculateGrandTotal = (totalCost, vat) => {
    return (totalCost += (totalCost * vat) / 100);
  };

  if (!selectedInvoice) {
    return <div>Please select an invoice.</div>;
  }

  const orderDate = selectedInvoice.orderDate;
  const parsedDate = isValid(new Date(orderDate)) ? new Date(orderDate) : new Date();
  const formattedOrderDate = format(parsedDate, 'EEEE, MMMM dd, yyyy');

  return (
    <Box>
      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2, md: 4 }}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5"># {editedInvoice.id}</Typography>
        <Box display="flex" gap={1}>
          {editing ? (
            <>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outlined" color="error" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="contained" color="info" onClick={() => setEditing(true)}>
              Edit Invoice
            </Button>
          )}
        </Box>
      </Stack>
      <Divider></Divider>

      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2, md: 4 }}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <CustomFormLabel htmlFor="demo-simple-select">Order Status</CustomFormLabel>
          <CustomSelect
            value={editedInvoice.status}
            onChange={(e) => setEditedInvoice({ ...editedInvoice, status: e.target.value })}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
          </CustomSelect>
        </Box>
        <Box textAlign="right">
          <CustomFormLabel htmlFor="demo-simple-select">Order Date</CustomFormLabel>
          <Typography variant="body1"> {formattedOrderDate}</Typography>
        </Box>
      </Stack>
      <Divider></Divider>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel>Bill From</CustomFormLabel>
          <CustomTextField
            value={editedInvoice.billFrom}
            onChange={(e) => setEditedInvoice({ ...editedInvoice, billFrom: e.target.value })}
            fullWidth
            error={Boolean(errors.billFrom)}
            helperText={errors.billFrom}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel
            sx={{
              mt: {
                xs: 0,
                sm: 3,
              },
            }}
          >
            Bill To
          </CustomFormLabel>
          <CustomTextField
            value={editedInvoice.billTo}
            onChange={(e) => setEditedInvoice({ ...editedInvoice, billTo: e.target.value })}
            fullWidth
            error={Boolean(errors.billTo)}
            helperText={errors.billTo}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel>From Email</CustomFormLabel>
          <CustomTextField
            type="email"
            value={editedInvoice.billFromEmail}
            onChange={(e) => setEditedInvoice({ ...editedInvoice, billFromEmail: e.target.value })}
            fullWidth
            error={Boolean(errors.billFromEmail)}
            helperText={errors.billFromEmail}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel>To Email</CustomFormLabel>
          <CustomTextField
            type="email"
            value={editedInvoice.billToEmail}
            onChange={(e) => setEditedInvoice({ ...editedInvoice, billToEmail: e.target.value })}
            fullWidth
            error={Boolean(errors.billToEmail)}
            helperText={errors.billToEmail}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel>From Phone</CustomFormLabel>
          <CustomTextField
            type="tel"
            value={editedInvoice.billFromPhone}
            onChange={(e) => setEditedInvoice({ ...editedInvoice, billFromPhone: e.target.value })}
            fullWidth
            error={Boolean(errors.billFromPhone)}
            helperText={errors.billFromPhone}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel>To Phone</CustomFormLabel>
          <CustomTextField
            type="tel"
            value={editedInvoice.billToPhone}
            onChange={(e) => setEditedInvoice({ ...editedInvoice, billToPhone: e.target.value })}
            fullWidth
            error={Boolean(errors.billToPhone)}
            helperText={errors.billToPhone}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel
            sx={{
              mt: 0,
            }}
          >
            From Address
          </CustomFormLabel>
          <CustomTextField
            value={editedInvoice.billFromAddress}
            onChange={(e) =>
              setEditedInvoice({
                ...editedInvoice,
                billFromAddress: e.target.value,
              })
            }
            fullWidth
            error={Boolean(errors.billFromAddress)}
            helperText={errors.billFromAddress}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel
            sx={{
              mt: 0,
            }}
          >
            Bill To Address
          </CustomFormLabel>
          <CustomTextField
            value={editedInvoice.billToAddress}
            onChange={(e) =>
              setEditedInvoice({
                ...editedInvoice,
                billToAddress: e.target.value,
              })
            }
            fullWidth
            error={Boolean(errors.billToAddress)}
            helperText={errors.billToAddress}
          />
        </Grid>
      </Grid>

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
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {editedInvoice.orders.map((order, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <CustomTextField
                      type="text"
                      value={order.itemName}
                      onChange={(e) => handleOrderChange(index, 'itemName', e.target.value)}
                      fullWidth
                      error={Boolean(errors[`orders.${index}.itemName`])}
                      helperText={errors[`orders.${index}.itemName`]}
                    />
                  </TableCell>
                  <TableCell>
                    <CustomTextField
                      type="number"
                      value={order.unitPrice}
                      onChange={(e) =>
                        handleOrderChange(index, 'unitPrice', parseFloat(e.target.value))
                      }
                      fullWidth
                      error={Boolean(errors[`orders.${index}.unitPrice`])}
                      helperText={errors[`orders.${index}.unitPrice`]}
                    />
                  </TableCell>
                  <TableCell>
                    <CustomTextField
                      type="number"
                      value={order.units}
                      onChange={(e) => handleOrderChange(index, 'units', parseInt(e.target.value))}
                      fullWidth
                      error={Boolean(errors[`orders.${index}.units`])}
                      helperText={errors[`orders.${index}.units`]}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{order.unitTotalPrice}</Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Add Item">
                      <IconButton onClick={handleAddItem} color="primary">
                        <IconSquareRoundedPlus width={22} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Item">
                      <IconButton color="error" onClick={() => handleDeleteItem(index)}>
                        <IconTrash width={22} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box p={3} bgcolor="primary.light" mt={3}>
        <Box display="flex" justifyContent="end" gap={3} mb={3}>
          <Typography variant="body1" fontWeight={600}>
            Sub Total:
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {editedInvoice.totalCost}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="end" gap={3} mb={3}>
          <Typography variant="body1" fontWeight={600}>
            VAT:
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {editedInvoice.vat}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="end" gap={3}>
          <Typography variant="body1" fontWeight={600}>
            Grand Total:
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {editedInvoice.grandTotal}
          </Typography>
        </Box>
      </Box>

      {showAlert && (
        <Alert severity="success" sx={{ position: 'fixed', top: 16, right: 16 }}>
          Invoice data updated successfully.
        </Alert>
      )}
    </Box>
  );
};

export default EditInvoicePage;

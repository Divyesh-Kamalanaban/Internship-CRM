/* eslint-disable no-unused-vars */

import React, { useState, useContext, useEffect } from 'react';
import axios from 'src/utils/axios';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format, isValid, addDays } from 'date-fns';
import { IconPlus, IconSquareRoundedPlus, IconTrash } from '@tabler/icons';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';

const CreateEstimate = () => {
  const router = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({
    id: Date.now(),
    estimateNumber: `EST-${Date.now()}`,
    status: 'Draft',
    validUntil: addDays(new Date(), 30).toISOString().split('T')[0],
    issueDate: new Date().toISOString().split('T')[0],
    clientDetails: {
      name: '',
      email: '',
      address: '',
      phone: ''
    },
    items: [],
    subtotal: 0,
    tax: 0,
    totalAmount: 0,
    currency: 'INR',
    billFrom: '',
    billTo: '',
    totalCost: 0,
    billFromAddress: '',
    billToAddress: '',
    orders: [{ itemName: '', unitPrice: '', units: '', unitTotalPrice: 0 }],
    vat: 0,
    grandTotal: 0,
    notes: '',
    terms: '',
  });

  const calculateTotals = (orders) => {
    let subtotal = 0;

    orders.forEach((order) => {
      const unitPrice = parseFloat(order.unitPrice) || 0;
      const units = parseInt(order.units) || 0;
      const totalCost = unitPrice * units;

      subtotal += totalCost;
      order.unitTotalPrice = totalCost;
    });

    const vat = subtotal * 0.1;
    const grandTotal = subtotal + vat;

    return { subtotal, vat, grandTotal };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newFormData = { ...prevData, [name]: value };
      const totals = calculateTotals(newFormData.orders);
      return {
        ...newFormData,
        ...totals,
      };
    });
  };

  const handleOrderChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedOrders = [...prevData.orders];
      updatedOrders[index] = {
        ...updatedOrders[index],
        [field]: value,
      };
      const totals = calculateTotals(updatedOrders);
      return {
        ...prevData,
        orders: updatedOrders,
        ...totals,
      };
    });
  };

  const handleAddItem = () => {
    setFormData((prevData) => {
      const updatedOrders = [
        ...prevData.orders,
        { itemName: '', unitPrice: '', units: '', unitTotalPrice: 0 },
      ];
      const totals = calculateTotals(updatedOrders);
      return {
        ...prevData,
        orders: updatedOrders,
        ...totals,
      };
    });
  };

  const handleDeleteItem = (index) => {
    setFormData((prevData) => {
      const updatedOrders = prevData.orders.filter((_, i) => i !== index);
      const totals = calculateTotals(updatedOrders);
      return {
        ...prevData,
        orders: updatedOrders,
        ...totals,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const estimateData = {
        id: Date.now(),
        estimateNumber: `EST-${Date.now()}`,
        clientDetails: {
          name: formData.billTo,
          address: formData.billToAddress
        },
        issueDate: formData.date,
        validUntil: formData.validUntil,
        items: formData.orders.map(order => ({
          itemName: order.itemName,
          description: order.itemName,
          quantity: parseInt(order.units),
          unitPrice: parseFloat(order.unitPrice),
          totalPrice: order.unitTotalPrice
        })),
        subtotal: formData.subtotal,
        tax: formData.vat,
        totalAmount: formData.grandTotal,
        status: formData.status,
        notes: formData.notes,
        terms: formData.terms
      };

      await axios.post('http://localhost:5000/api/estimate', estimateData);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        router('/apps/estimates/list');
      }, 2000);
    } catch (error) {
      console.error('Error adding estimate:', error);
    }
  };

  const parsedDate = isValid(new Date(formData.date)) ? new Date(formData.date) : new Date();
  const formattedOrderDate = format(parsedDate, 'EEEE, MMMM dd, yyyy');
  const validUntilDate = isValid(new Date(formData.validUntil)) ? new Date(formData.validUntil) : addDays(new Date(), 30);
  const formattedValidUntil = format(validUntilDate, 'EEEE, MMMM dd, yyyy');

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
            <Typography variant="h5"># {formData.id}</Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  router('/apps/estimates/list');
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Create Estimate
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
              <CustomFormLabel htmlFor="status">Estimate Status</CustomFormLabel>
              <CustomSelect
                labelId="status-label"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Sent">Sent</MenuItem>
                <MenuItem value="Accepted">Accepted</MenuItem>
                <MenuItem value="Declined">Declined</MenuItem>
              </CustomSelect>
            </Box>
            <Box textAlign="right">
              <CustomFormLabel>Valid Until</CustomFormLabel>
              <Typography variant="body1">{formattedValidUntil}</Typography>
            </Box>
          </Stack>
          <Divider />

          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="bill-from">Bill From</CustomFormLabel>
              <CustomTextField
                id="bill-from"
                name="billFrom"
                value={formData.billFrom}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="bill-to">Bill To</CustomFormLabel>
              <CustomTextField
                id="bill-to"
                name="billTo"
                value={formData.billTo}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="from-address">From Address</CustomFormLabel>
              <CustomTextField
                id="from-address"
                name="billFromAddress"
                value={formData.billFromAddress}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="to-address">Bill To Address</CustomFormLabel>
              <CustomTextField
                id="to-address"
                name="billToAddress"
                value={formData.billToAddress}
                onChange={handleChange}
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
                  {formData.orders.map((order, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <CustomTextField
                          type="text"
                          value={order.itemName}
                          placeholder="Item Name"
                          onChange={(e) => handleOrderChange(index, 'itemName', e.target.value)}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          type="number"
                          value={order.unitPrice}
                          placeholder="Unit Price"
                          onChange={(e) => handleOrderChange(index, 'unitPrice', e.target.value)}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <CustomTextField
                          type="number"
                          value={order.units}
                          placeholder="Units"
                          onChange={(e) => handleOrderChange(index, 'units', e.target.value)}
                          fullWidth
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
                          <IconButton onClick={() => handleDeleteItem(index)} color="error">
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

          <Box mt={3}>
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
          </Box>

          <Box mt={3}>
            <CustomFormLabel htmlFor="terms">Terms and Conditions</CustomFormLabel>
            <CustomTextField
              id="terms"
              name="terms"
              value={formData.terms}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
          </Box>

          <Box p={3} bgcolor="primary.light" mt={3}>
            <Box display="flex" justifyContent="end" gap={3} mb={3}>
              <Typography variant="body1" fontWeight={600}>
                Sub Total:
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {formData.subtotal}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="end" gap={3} mb={3}>
              <Typography variant="body1" fontWeight={600}>
                VAT:
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {formData.vat}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="end" gap={3}>
              <Typography variant="body1" fontWeight={600}>
                Grand Total:
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {formData.grandTotal}
              </Typography>
            </Box>
          </Box>

          {showAlert && (
            <Alert severity="success" sx={{ position: 'fixed', top: 16, right: 16 }}>
              Estimate created successfully.
            </Alert>
          )}
        </Box>
      </form>
    </>
  );
};

export default CreateEstimate;
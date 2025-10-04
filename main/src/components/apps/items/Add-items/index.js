import React, { useState, useContext } from 'react';
import { ItemsContext } from 'src/context/ItemsContext';
import {
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  IconButton,
  Alert,
} from '@mui/material';
import { IconPlus, IconTrash } from '@tabler/icons';

const AddItems = () => {
  const { addItems } = useContext(ItemsContext);
  const [formData, setFormData] = useState({
    description: '',
    rate: '',
    Tax: '',
    itemGroup: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.description || !formData.rate || !formData.Tax) {
      setError('All fields are required.');
      return;
    }

    try {
      await addItems(formData);
      setSuccess(true);
      setFormData({
        description: '',
        rate: '',
        Tax: '',
        itemGroup: '',
      });
    } catch (err) {
      setError('Failed to add item. Please try again.');
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" mb={2}>
          Add New Item
        </Typography>
        <Divider />
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Rate"
              name="rate"
              type="number"
              value={formData.rate}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tax"
              name="Tax"
              type="number"
              value={formData.Tax}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Item Group"
              name="itemGroup"
              value={formData.itemGroup}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2} mt={3}>
          <Button type="submit" variant="contained" color="primary">
            Add Item
          </Button>
          <Button type="reset" variant="outlined" onClick={() => setFormData({ description: '', rate: '', Tax: '', itemGroup: '' })}>
            Reset
          </Button>
        </Stack>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>Item added successfully!</Alert>}
      </form>
    </Box>
  );
};

export default AddItems;

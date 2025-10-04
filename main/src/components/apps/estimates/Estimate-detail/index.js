import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { IconDownload, IconArrowLeft } from '@tabler/icons';
import axiosServices from '../../../../utils/axios';

const EstimateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        setLoading(true);
        const response = await axiosServices.get(`/estimate/${id}`);
        setEstimate(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching estimate:', error);
        setError('Failed to load estimate details');
      } finally {
        setLoading(false);
      }
    };

    fetchEstimate();
  }, [id]);

  const handleViewPdf = async () => {
    try {
      const response = await axiosServices.get(`/estimate/${id}/pdf`, {
        responseType: 'blob'
      });
      
      // Create a blob URL from the PDF data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Open PDF in a new window/tab
      window.open(url, '_blank');
      
      // Clean up the blob URL after a short delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error viewing estimate PDF:', error);
      alert('Failed to view estimate PDF');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!estimate) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Estimate not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          variant="outlined"
          startIcon={<IconArrowLeft />}
          onClick={() => navigate('/apps/estimates/list')}
        >
          Back to Estimates
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<IconDownload />}
          onClick={handleViewPdf}
        >
          View PDF
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Estimate Details
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Estimate ID
              </Typography>
              <Typography variant="body1">{estimate._id || estimate.id}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Status
              </Typography>
              <Chip
                label={estimate.status}
                color={estimate.status === "Approved" ? "success" : "warning"}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Issue Date
              </Typography>
              <Typography variant="body1">
                {new Date(estimate.issueDate).toLocaleDateString()}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="textSecondary">
                Valid Until
              </Typography>
              <Typography variant="body1">
                {new Date(estimate.validUntil).toLocaleDateString()}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary">
                Client Details
              </Typography>
              <Box mt={1}>
                <Typography variant="body1">Name: {estimate.clientDetails.name}</Typography>
                <Typography variant="body1">Email: {estimate.clientDetails.email}</Typography>
                <Typography variant="body1">Phone: {estimate.clientDetails.phone}</Typography>
                <Typography variant="body1">Address: {estimate.clientDetails.address}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary">
                Items
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {estimate.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR'
                          }).format(item.unitPrice || 0)}
                        </TableCell>
                        <TableCell align="right">
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR'
                          }).format((item.quantity * item.unitPrice) || 0)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Typography variant="subtitle1" color="textSecondary">
                  Subtotal:
                </Typography>
                <Typography variant="body1">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR'
                  }).format(estimate.subtotal || 0)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Typography variant="subtitle1" color="textSecondary">
                  Tax:
                </Typography>
                <Typography variant="body1">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR'
                  }).format(estimate.tax || 0)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Typography variant="subtitle1" color="textSecondary">
                  Total Amount:
                </Typography>
                <Typography variant="body1">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR'
                  }).format(estimate.totalAmount || 0)}
                </Typography>
              </Box>
            </Grid>

            {estimate.notes && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="textSecondary">
                  Notes
                </Typography>
                <Typography variant="body1">{estimate.notes}</Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EstimateDetail; 
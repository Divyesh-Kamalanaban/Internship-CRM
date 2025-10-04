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
} from '@mui/material';
import { IconDownload, IconArrowLeft } from '@tabler/icons';
import { paymentService } from 'src/services/api';

const PaymentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await paymentService.getPayment(id);
        setPayment(response.data);
      } catch (error) {
        console.error('Error fetching payment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  const handleDownload = async () => {
    if (!payment) return;
    
    try {
      setDownloading(true);
      const response = await paymentService.getPaymentPDF(payment._id);
      
      // Create a blob from the PDF stream
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a link element and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payment-${payment._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading payment:', error);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!payment) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="h6">Payment not found</Typography>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<IconArrowLeft />}
            onClick={() => navigate('/apps/payments')}
          >
            Back to Payments
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<IconDownload />}
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? 'Downloading...' : 'Download PDF'}
          </Button>
        </Box>

        <Typography variant="h5" gutterBottom>
          Payment Details
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Payment ID
            </Typography>
            <Typography variant="body1">{payment.id}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Invoice
            </Typography>
            <Typography variant="body1">{payment.invoiceId}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Amount
            </Typography>
            <Typography variant="body1">${payment.amount}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Payment Date
            </Typography>
            <Typography variant="body1">
              {new Date(payment.paymentDate).toLocaleDateString()}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Payment Method
            </Typography>
            <Typography variant="body1">{payment.paymentMethod}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Status
            </Typography>
            <Chip
              label={payment.status || 'Pending'}
              color={
                payment.status === 'Completed'
                  ? 'success'
                  : payment.status === 'Pending'
                  ? 'warning'
                  : 'error'
              }
            />
          </Grid>

          {payment.notes && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="textSecondary">
                Notes
              </Typography>
              <Typography variant="body1">{payment.notes}</Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PaymentDetail; 
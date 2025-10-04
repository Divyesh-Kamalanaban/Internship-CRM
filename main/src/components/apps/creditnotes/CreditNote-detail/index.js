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
  Alert,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import { IconDownload, IconArrowLeft } from '@tabler/icons';
import axiosServices from '../../../../utils/axios';

const CreditNoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creditNote, setCreditNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCreditNote = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching credit note with ID:', id);
        const response = await axiosServices.get(`/credit-note/${id}`);
        console.log('Credit note data:', response.data);
        setCreditNote(response.data);
      } catch (error) {
        console.error('Error fetching credit note:', error);
        setError(error.response?.data?.message || error.message || 'Failed to fetch credit note');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCreditNote();
    }
  }, [id]);

  const handleDownload = async () => {
    if (!creditNote) return;
    
    try {
      setDownloading(true);
      setError(null);
      const response = await axiosServices.get(`/credit-note/${creditNote._id || creditNote.id}/pdf`, {
        responseType: 'blob'
      });
      
      // Create a blob from the PDF stream
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a link element and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `credit-note-${creditNote._id || creditNote.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading credit note:', error);
      setError('Failed to download PDF. Please try again later.');
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

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button
            variant="outlined"
            startIcon={<IconArrowLeft size={18} />}
            onClick={() => navigate('/apps/creditnotes/list')}
          >
            Back to Credit Notes
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!creditNote) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom color="error">
            Credit Note not found
          </Typography>
          <Button
            variant="outlined"
            startIcon={<IconArrowLeft size={18} />}
            onClick={() => navigate('/apps/creditnotes/list')}
          >
            Back to Credit Notes
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Button
            variant="outlined"
            startIcon={<IconArrowLeft size={18} />}
            onClick={() => navigate('/apps/creditnotes/list')}
          >
            Back to Credit Notes
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={downloading ? <CircularProgress size={18} color="inherit" /> : <IconDownload size={18} />}
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? 'Downloading...' : 'Download PDF'}
          </Button>
        </Box>

        <Typography variant="h4" gutterBottom>
          Credit Note Details
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Credit Note Information
            </Typography>
            <Box mb={2}>
              <Typography variant="subtitle2" color="textSecondary">
                Credit Note #
              </Typography>
              <Typography variant="body1">{creditNote.id}</Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle2" color="textSecondary">
                Amount
              </Typography>
              <Typography variant="body1">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: creditNote.currency || 'INR'
                }).format(creditNote.amount)}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle2" color="textSecondary">
                Issue Date
              </Typography>
              <Typography variant="body1">
                {new Date(creditNote.issueDate).toLocaleDateString()}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle2" color="textSecondary">
                Status
              </Typography>
              <Chip
                label={creditNote.status}
                color={
                  creditNote.status === 'Issued'
                    ? 'success'
                    : creditNote.status === 'Draft'
                    ? 'warning'
                    : creditNote.status === 'Void'
                    ? 'error'
                    : 'default'
                }
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Reference Information
            </Typography>
            {creditNote.invoiceId && (
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  Invoice Reference
                </Typography>
                <Typography variant="body1">{creditNote.invoiceId}</Typography>
              </Box>
            )}
            {creditNote.estimateId && (
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  Estimate Reference
                </Typography>
                <Typography variant="body1">{creditNote.estimateId}</Typography>
              </Box>
            )}
            {creditNote.reason && (
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  Reason
                </Typography>
                <Typography variant="body1">{creditNote.reason}</Typography>
              </Box>
            )}
          </Grid>
        </Grid>

        {creditNote.items && creditNote.items.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
              Items
            </Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  {creditNote.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: creditNote.currency || 'INR'
                        }).format(item.unitPrice)}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell align="right">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: creditNote.currency || 'INR'
                        }).format(item.totalPrice)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        <Divider sx={{ my: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {creditNote.notes && (
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  Notes
                </Typography>
                <Typography variant="body1">{creditNote.notes}</Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <Box display="flex" justifyContent="space-between" width="100%" maxWidth={300} mb={1}>
                <Typography variant="subtitle2">Subtotal:</Typography>
                <Typography>
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: creditNote.currency || 'INR'
                  }).format(creditNote.subtotal)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" width="100%" maxWidth={300} mb={1}>
                <Typography variant="subtitle2">Tax:</Typography>
                <Typography>
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: creditNote.currency || 'INR'
                  }).format(creditNote.tax)}
                </Typography>
              </Box>
              <Divider sx={{ width: '100%', maxWidth: 300, my: 1 }} />
              <Box display="flex" justifyContent="space-between" width="100%" maxWidth={300}>
                <Typography variant="h6">Total Amount:</Typography>
                <Typography variant="h6" color="primary">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: creditNote.currency || 'INR'
                  }).format(creditNote.totalAmount)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CreditNoteDetail; 
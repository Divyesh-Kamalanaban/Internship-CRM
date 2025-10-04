import { useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button,
  Stack,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../../../context/AppContext';

const EstimateList = () => {
  const navigate = useNavigate();
  const { estimates, loading, error, fetchEstimates, deleteEstimate } = useAppContext();

  useEffect(() => {
    fetchEstimates();
  }, [fetchEstimates]);

  const handleDelete = async (id) => {
    try {
      await deleteEstimate(id);
    } catch (error) {
      console.error('Error deleting estimate:', error);
      alert('Error deleting estimate: ' + (error.response?.data?.message || error.message || 'Unknown error occurred'));
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'expired':
        return 'default';
      default:
        return 'default';
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
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h3">Estimates</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/apps/estimates/create')}
          >
            Create Estimate
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Estimate #</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Valid Until</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {estimates.map((estimate) => (
                <TableRow key={estimate._id || estimate.id}>
                  <TableCell>{estimate.id}</TableCell>
                  <TableCell>{estimate.clientDetails?.name || 'N/A'}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    }).format(estimate.totalAmount)}
                  </TableCell>
                  <TableCell>
                    {new Date(estimate.issueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(estimate.validUntil).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={estimate.status}
                      color={getStatusColor(estimate.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Estimate">
                        <IconButton
                          color="primary"
                          component={Link}
                          to={`/apps/estimates/detail/${estimate._id || estimate.id}`}
                        >
                          <IconEye width={22} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          color="success"
                          onClick={() =>
                            navigate(`/apps/estimates/edit/${estimate._id || estimate.id}`)
                          }
                        >
                          <IconEdit size="18" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(estimate._id || estimate.id)}
                        >
                          <IconTrash size="18" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default EstimateList;
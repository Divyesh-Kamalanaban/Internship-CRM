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

const CreditNoteList = () => {
  const navigate = useNavigate();
  const { creditNotes, loading, error, fetchCreditNotes, deleteCreditNote } = useAppContext();

  useEffect(() => {
    fetchCreditNotes();
  }, [fetchCreditNotes]);

  const handleDelete = async (id) => {
    try {
      await deleteCreditNote(id);
    } catch (error) {
      console.error('Error deleting credit note:', error);
      alert('Error deleting credit note: ' + (error.response?.data?.message || error.message || 'Unknown error occurred'));
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'issued':
        return 'success';
      case 'draft':
        return 'warning';
      case 'void':
        return 'error';
      case 'applied':
        return 'info';
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
          <Typography variant="h3">Credit Notes</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/apps/creditnotes/create')}
          >
            Create Credit Note
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Credit Note #</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {creditNotes.map((creditNote) => (
                <TableRow key={creditNote._id || creditNote.id}>
                  <TableCell>{creditNote.id}</TableCell>
                  <TableCell>{creditNote.issuedTo?.name || 'N/A'}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    }).format(creditNote.amount)}
                  </TableCell>
                  <TableCell>
                    {new Date(creditNote.issueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={creditNote.status}
                      color={getStatusColor(creditNote.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Credit Note">
                        <IconButton
                          color="primary"
                          component={Link}
                          to={`/apps/creditnotes/detail/${creditNote._id || creditNote.id}`}
                        >
                          <IconEye width={22} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          color="success"
                          onClick={() =>
                            navigate(`/apps/creditnotes/edit/${creditNote._id || creditNote.id}`)
                          }
                        >
                          <IconEdit size="18" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(creditNote._id || creditNote.id)}
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

export default CreditNoteList;